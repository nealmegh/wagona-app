package com.wagona.maths.Utils;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.HttpHeaderParser;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;

public class MultipartRequest extends Request<String> {

    private final MultipartBody.Builder builder = new MultipartBody.Builder().setType(MultipartBody.FORM);

    private final Response.Listener<String> mListener;
    private final File file; // image_path
    private final Map<String, String> params;

    public MultipartRequest(String url, Response.Listener<String> listener, Response.ErrorListener errorListener, File file, Map<String, String> params) {
        super(Method.POST, url, errorListener);

        mListener = listener;
        this.file = file;
        this.params = params;

        buildMultipartEntity();
    }

    private void buildMultipartEntity() {
        if (file != null) {
            RequestBody requestBody = RequestBody.create(MediaType.parse("image/*"), file);
            builder.addFormDataPart("VPROFILEIMAGE", file.getName(), requestBody);
            VolleyLog.e("KEY: VPROFILEIMAGE ---- VAL: " + file.getAbsolutePath());
        }

        for (String key : params.keySet()) {
            String value = params.get(key);
            RequestBody requestBody = RequestBody.create(MediaType.parse("text/plain"), value);
            builder.addFormDataPart(key, value);
            VolleyLog.e("KEY: " + key + " ---- VAL: " + value);
        }
    }

    @Override
    public String getBodyContentType() {
        return builder.build().contentType().toString();
    }

    @Override
    public byte[] getBody() throws AuthFailureError {
        return new byte[0]; // Return an empty byte array as Volley will not use this.
    }

    @Override
    protected Response<String> parseNetworkResponse(NetworkResponse response) {
        String parsed;
        try {
            parsed = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
        } catch (UnsupportedEncodingException e) {
            parsed = new String(response.data);
        }
        return Response.success(parsed, HttpHeaderParser.parseCacheHeaders(response));
    }

    @Override
    protected void deliverResponse(String response) {
        mListener.onResponse(response);
    }
}
