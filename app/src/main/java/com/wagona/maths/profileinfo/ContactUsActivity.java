package com.wagona.maths.profileinfo;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.wagona.maths.AppController;
import com.wagona.maths.BaseActivity;
import com.wagona.maths.R;
import com.wagona.maths.Utils.GravityCompoundDrawable;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sotsys-159 on 14/4/16.
 */
public class ContactUsActivity extends BaseActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_us);
        setScreenToolbar();
        initControls();
    }


    private Toolbar toolbar;

    private void setScreenToolbar() {
        toolbar = (Toolbar) findViewById(R.id.headerStrip);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        textHeader.setText("Contact Us");


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

    private LinearLayout layoutSocialC;
    private LinearLayout layoutAddress;

    private EditText txtName;
    private EditText txtEmail;
    private EditText txtMobile;
    private EditText txtSubject;
    private EditText exitYourMsg;

    private TextView imageButtonSend;

    private void initControls() {


        txtName = (EditText) findViewById(R.id.txtName);
        txtEmail = (EditText) findViewById(R.id.txtEmail);
        txtMobile = (EditText) findViewById(R.id.txtMobile);
        txtSubject = (EditText) findViewById(R.id.txtSubject);
        exitYourMsg = (EditText) findViewById(R.id.exitYourMsg);

        imageButtonSend = (TextView) findViewById(R.id.imageButtonSend);

        imageButtonSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (isValide()) {

                    callContactUsApi();
                }


            }
        });


        EditText exitYourMsg = (EditText) findViewById(R.id.exitYourMsg);
        Drawable innerDrawable = getResources().getDrawable(R.drawable.comment);

        GravityCompoundDrawable gravityDrawable = new GravityCompoundDrawable(innerDrawable);
        innerDrawable.setBounds(0, 0, innerDrawable.getIntrinsicWidth(), innerDrawable.getIntrinsicHeight());
        gravityDrawable.setBounds(0, convertDpToPixel(30), innerDrawable.getIntrinsicWidth(), innerDrawable.getIntrinsicHeight());
        exitYourMsg.setCompoundDrawables(gravityDrawable, null, null, null);


        callSocialLinkApi();   // This API is used to get sociallinks  like as Fb , lin , google+ , twitter etc. Display in Spinner .

        layoutSocialC = (LinearLayout) findViewById(R.id.layoutSocialC);
        layoutSocialC.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                closeKeyboard(true);
                showSocialChannels();

            }
        });

        layoutAddress = (LinearLayout) findViewById(R.id.layoutAddress);
        layoutAddress.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                closeKeyboard(true);
                addressDialog();

            }


        });


    }

    private void callContactUsApi() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + CONTACT_US, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                try {
                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        showOkDialogClose(ContactUsActivity.this, mJsonObject.getString("message"));

                    }


                } catch (Exception e) {
                    e.printStackTrace();
                }

                closeProgressDialog();

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                closeProgressDialog();

                if (error.toString().contains("TimeoutError")) {
                    showRetryDialog(error.toString());
                }

                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {

                Map<String, String> params = new HashMap<String, String>();
                params.put(PERSON_NAME, txtName.getText().toString().trim());
                params.put(PERSON_EMAIL, txtEmail.getText().toString().trim());
                params.put(MOBILE_NUMBER, txtMobile.getText().toString().trim());
                params.put(SUBJECT, txtSubject.getText().toString().trim());
                params.put(TX_MESSAGE, exitYourMsg.getText().toString().trim());

                params = SecurityUtils.setSecureParams(params);
                return params;
            }
        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);


    }

    private void showRetryDialog(String error) {
        androidx.appcompat.app.AlertDialog.Builder alertDialogBuilder = new androidx.appcompat.app.AlertDialog.Builder(
                ContactUsActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callContactUsApi();

                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        finish();
                    }
                });

        // create alert dialog
        androidx.appcompat.app.AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();


    }

    public boolean isValide() {

        if (txtName.getText().toString().trim().length() == 0) {
            txtName.setError(getString(R.string.valid_name));
            return false;
        } else if (txtEmail.getText().toString().trim().length() == 0) {
            txtEmail.setError(getString(R.string.valid_email_address));
            return false;
        } else if (!isValidEmail(txtEmail.getText().toString().trim())) {
            txtEmail.setError(getString(R.string.valid_email_pattern));
            return false;
        } else if (txtMobile.getText().toString().trim().length() == 0 || txtMobile.getText().toString().trim().length() < 10) {
            txtMobile.setError(getString(R.string.valid_mobile));
            return false;
        } else if (txtSubject.getText().toString().trim().length() == 0) {
            txtSubject.setError(getString(R.string.valid_subject));
            return false;
        } else if (exitYourMsg.getText().toString().trim().length() == 0) {
            exitYourMsg.setError(getString(R.string.valid_your_message));
            return false;
        }

        return true;
    }

    HashMap<String, String> mSocialLinks = new HashMap<>();

    List<String> mSocialLinkList = new ArrayList<>();

    String mSocialLinkID = null;

    private void callSocialLinkApi() {


        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");
        mSocialLinks.clear();
        mSocialLinkList.clear();

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_SOCIALLINKS, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                try {

                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        JSONArray mJsonArray = mJsonObject.getJSONArray("sociallinks");

                        for (int i = 0; i < mJsonArray.length(); i++) {
                            mSocialLinkList.add(mJsonArray.getJSONObject(i).getString("vSocialLink"));
                            mSocialLinks.put(mJsonArray.getJSONObject(i).getString("vSocialLink"),
                                    mJsonArray.getJSONObject(i).getString("vSocialName"));
                        }
                    } else {

                            showOkDialog(ContactUsActivity.this, mJsonObject.getString(MESSAGE));

                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }

                closeProgressDialog();

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                closeProgressDialog();
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {

                Map<String, String> params = new HashMap<String, String>();
                params = SecurityUtils.setSecureParams(params);
                return params;
            }


        };


        AppController.getInstance(this).addToRequestQueue(mStringRequest);


    }

    private void addressDialog() {

        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(this, R.style.MyAlertDialogTheme);
        LayoutInflater inflater = this.getLayoutInflater();
        final View dialogView = inflater.inflate(R.layout.dialog_address, null);
        dialogBuilder.setView(dialogView);
        AlertDialog b = dialogBuilder.create();
        b.show();

        TextView textContactAddress = (TextView) dialogView.findViewById(R.id.textContactAddress);

        textContactAddress.setText(mSocialLinkList.get(5).toString());


    }

    private void showSocialChannels() {


        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(this, R.style.MyAlertDialogTheme);
        LayoutInflater inflater = this.getLayoutInflater();
        final View dialogView = inflater.inflate(R.layout.dialog_social_channels, null);
        dialogBuilder.setView(dialogView);
        AlertDialog b = dialogBuilder.create();
        b.show();


        ImageView imgFacebook = (ImageView) dialogView.findViewById(R.id.imgFacebook);
        ImageView imgTwitter = (ImageView) dialogView.findViewById(R.id.imgTwitter);
        ImageView imgGoogleplus = (ImageView) dialogView.findViewById(R.id.imgGoogleplus);
        ImageView imgYoutube = (ImageView) dialogView.findViewById(R.id.imgYoutube);
        ImageView imgpintrest = (ImageView) dialogView.findViewById(R.id.imgpintrest);

        imgFacebook.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                try {

                    Intent intent = new Intent(Intent.ACTION_VIEW).setData(Uri.parse(mSocialLinkList.get(0).toString()));
                    startActivity(intent);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });


        imgTwitter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                try {


                    Intent intenttwitter = new Intent(Intent.ACTION_VIEW).setData(Uri.parse(mSocialLinkList.get(1).toString()));
                    startActivity(intenttwitter);


                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });


        imgGoogleplus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                try {


                    Intent intentgoogleplus = new Intent(Intent.ACTION_VIEW).setData(Uri.parse(mSocialLinkList.get(2).toString()));
                    startActivity(intentgoogleplus);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        imgYoutube.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                try {


                    Intent intentyoutube = new Intent(Intent.ACTION_VIEW).setData(Uri.parse(mSocialLinkList.get(3).toString()));
                    startActivity(intentyoutube);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        imgpintrest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                try {

                    Intent intentpintrest = new Intent(Intent.ACTION_VIEW).setData(Uri.parse(mSocialLinkList.get(4).toString()));
                    startActivity(intentpintrest);


                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

      /*  WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(b.getWindow().getAttributes());
        lp.width = WindowManager.LayoutParams.MATCH_PARENT;
        lp.height = WindowManager.LayoutParams.WRAP_CONTENT;
        b.show();
        b.getWindow().setAttributes(lp);*/


    }

    public int convertDpToPixel(int dp) {

        DisplayMetrics metrics = getResources().getDisplayMetrics();
        int px = (int) (dp * ((float) metrics.densityDpi / DisplayMetrics.DENSITY_DEFAULT));
        return px;
    }


}
