package com.nomoney.cam;

import android.Manifest;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

// Saves a JPEG (base64) into Pictures/NomoneyCAM so the phone's Photos app shows it.
// Android 10+ writes through MediaStore and needs no permission; Android 7-9 writes the file and needs storage permission.
@CapacitorPlugin(name = "GallerySaver", permissions = @Permission(alias = "storage", strings = {Manifest.permission.WRITE_EXTERNAL_STORAGE}))
public class GallerySaverPlugin extends Plugin {
    private static final String DIR = "NomoneyCAM";

    @PluginMethod
    public void save(PluginCall call) {
        if (Build.VERSION.SDK_INT < 29 && getPermissionState("storage") != PermissionState.GRANTED) {
            requestPermissionForAlias("storage", call, "storageResult");
            return;
        }
        write(call);
    }

    @PermissionCallback
    private void storageResult(PluginCall call) {
        if (getPermissionState("storage") == PermissionState.GRANTED) write(call);
        else call.reject("Storage permission denied");
    }

    private void write(PluginCall call) {
        String data = call.getString("data");
        if (data == null) { call.reject("No data"); return; }
        String name = call.getString("name", "shot-" + System.currentTimeMillis() + ".jpg").replaceAll("[^A-Za-z0-9._-]", "_");
        ContentResolver r = getContext().getContentResolver();
        Uri uri = null;
        try {
            byte[] bytes = Base64.decode(data, Base64.DEFAULT);
            if (Build.VERSION.SDK_INT >= 29) {
                ContentValues v = new ContentValues();
                v.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                v.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                v.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/" + DIR);
                v.put(MediaStore.Images.Media.IS_PENDING, 1);
                uri = r.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, v);
                if (uri == null) throw new IOException("MediaStore insert failed");
                try (OutputStream o = r.openOutputStream(uri)) { o.write(bytes); }
                v.clear();
                v.put(MediaStore.Images.Media.IS_PENDING, 0);
                r.update(uri, v, null, null);
            } else {
                File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), DIR);
                if (!dir.exists() && !dir.mkdirs()) throw new IOException("Cannot create " + dir);
                File f = new File(dir, name);
                try (FileOutputStream o = new FileOutputStream(f)) { o.write(bytes); }
                MediaScannerConnection.scanFile(getContext(), new String[]{f.getAbsolutePath()}, new String[]{"image/jpeg"}, null);
                uri = Uri.fromFile(f);
            }
            JSObject out = new JSObject();
            out.put("uri", uri.toString());
            call.resolve(out);
        } catch (Exception e) {
            if (uri != null && Build.VERSION.SDK_INT >= 29) r.delete(uri, null, null); // do not leave a half-written pending row
            call.reject("Save failed: " + e.getMessage());
        }
    }
}
