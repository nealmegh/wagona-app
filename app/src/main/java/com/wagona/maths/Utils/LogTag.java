package com.wagona.maths.Utils;

import android.util.Log;

import com.wagona.maths.WagonaApp;


/**
 * Created by Dhaval PC on 6/3/2015.
 */
public class LogTag {

    public static final String TAG = "log_tag";

    public static void d(String msg) {
        if (WagonaApp.isDebug) {
            Log.d(TAG, msg);
        }
    }

    public static void v(String msg) {
        if (WagonaApp.isDebug) {
            Log.v(TAG, msg);
        }
    }

    public static void e(String msg, Exception e) {
        if (WagonaApp.isDebug) {
            Log.e(TAG, msg, e);
        }
    }

    public static void e(String msg) {
        if (WagonaApp.isDebug) {
            Log.e(TAG, msg);
        }
    }

}
