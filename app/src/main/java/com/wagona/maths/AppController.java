package com.wagona.maths;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

/**
 * Created by Amit on 12/1/16.
 */
public class AppController {

    /**
     * Main application controller call
     * also contain Volley requests queue.
     * */
    private static AppController mInstance;
    private RequestQueue mRequestQueue;
    private static Context mCtx;


    private AppController(Context context){
        mCtx = context;
        mRequestQueue = getRequestQueue();
    }

    public static AppController getInstance(Context context) {
        if (mInstance == null) {
            mInstance = new AppController(context);
        }
        return mInstance;
    }

    public RequestQueue getRequestQueue() {
        if (mRequestQueue == null) {
            mRequestQueue = Volley.newRequestQueue(mCtx.getApplicationContext());
        }
        return mRequestQueue;
    }

    public <T> void addToRequestQueue(@NonNull final Request<T> request) {
        Log.e("Req", request.toString());
        Log.e("Req", request.getUrl());
        request.setRetryPolicy(new DefaultRetryPolicy(150000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        getRequestQueue().add(request);
    }

    public <T> void addToRequestQueueWithTag(@NonNull final Request<T> request, String tag) {
        request.setTag(tag);
        getRequestQueue().add(request);
    }


}