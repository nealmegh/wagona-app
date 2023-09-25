package com.wagona.maths;

import android.content.Context;
import android.os.Environment;
import android.widget.Toast;

import androidx.multidex.MultiDex;
import androidx.multidex.MultiDexApplication;

import com.android.volley.NetworkResponse;
import com.splunk.mint.Mint;
import com.wagona.maths.Utils.LogTag;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

/**
 * Created by sotsys-159 on 13/6/16.
 */
public class WagonaApp extends MultiDexApplication {

    public static boolean isDebug = false;
    private static WagonaApp app;

    @Override
    public void onCreate() {
        super.onCreate();

        isDebug = false;

        app = this;

        if (!isDebug) {
            Mint.initAndStartSession(this, "400b8cdd");
        }
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    public static WagonaApp getApp() {
        return app;
    }

    public void setAPIErrorLog(NetworkResponse networkResponse) {

        if (networkResponse == null)
            return;

        LogTag.e("networkResponse Status Code " + networkResponse.statusCode);

        String body = null;
        try {
            body = new String(networkResponse.data, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            // exception
            e.printStackTrace();
        }

        LogTag.e("networkResponse Data " + body);

        saveErrorLog(this, body);
    }

    public void saveErrorLog(Context context, String sBody) {
        try {
            File root = new File(Environment.getExternalStorageDirectory(), "Wagona Maths");
            if (!root.exists()) {
                root.mkdirs();
            }
            File gpxfile = new File(root, "error.txt");
            FileWriter writer = new FileWriter(gpxfile);
            writer.append(sBody);
            writer.flush();
            writer.close();
            Toast.makeText(context, "Erro Log Saved", Toast.LENGTH_SHORT).show();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
