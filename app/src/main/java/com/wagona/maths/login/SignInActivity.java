package com.wagona.maths.login;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.wagona.maths.AppController;
import com.wagona.maths.BaseActivity;
import com.wagona.maths.HomeActivity;
import com.wagona.maths.R;
import com.wagona.maths.Utils.Databasehelper;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;

import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by sotsys-159 on 12/4/16.
 */
public class SignInActivity extends BaseActivity {


    private void CreateDatabase() {

        Databasehelper myDbHelper;
        myDbHelper = new Databasehelper(SignInActivity.this);

        try {
            myDbHelper.createDataBase();
        } catch (IOException ioe) {
            throw new Error("Unable to create database");
        }
        myDbHelper.close();


    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        CreateDatabase();

        Toolbar toolbar = (Toolbar) findViewById(R.id.headerStrip);
        toolbar.setTitle("");
        setSupportActionBar(toolbar);


        initControls();
        Log.d("SignInActivity", "onCreate called");

    }

    private EditText editTextPassword;
    private EditText editTextEmail;
    private CheckBox checkBoxRemember;

    private void initControls() {

        editTextPassword = (EditText) findViewById(R.id.editTextPassword);
        editTextEmail = (EditText) findViewById(R.id.editTextEmailSign);


       /* editTextEmail.setText("manyereidah@yahoo.com");
        editTextPassword.setText("winniecm");*/

        checkBoxRemember = (CheckBox) findViewById(R.id.checkBoxRemember);
        checkBoxRemember.setChecked(false);
        managerWagona.setBooleanDetail(REMEMBER_ME, false);

        checkBoxRemember.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {

                managerWagona.setBooleanDetail(REMEMBER_ME, isChecked);

            }
        });


        (findViewById(R.id.textViewForgot)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // go to forgot password
                Intent intent = new Intent(SignInActivity.this, ForgotPasswordActivity.class);
                startActivity(intent);


            }
        });


        (findViewById(R.id.imageButtonSignIn)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // sign in button press

                if (isValidate()) {
                    callLogin();
                }


            }
        });

        (findViewById(R.id.signUpRedirectLayout)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //sign up screen

                Intent intent = new Intent(SignInActivity.this, SignUpActivity.class);
                startActivity(intent);


            }
        });


    }


    public boolean isValidate() {

        if (editTextEmail.getText().toString().trim().length() == 0) {
            editTextEmail.setError(getString(R.string.valid_email_address));
            return false;
        }/* else if (!isValidEmail(editTextEmail.getText().toString().trim())) {
            editTextEmail.setError(getString(R.string.valid_email_pattern));
            return false;
        }*/ else if (editTextPassword.getText().toString().trim().length() == 0) {
            editTextPassword.setError("Please enter valid password");
            return false;
        } /*else if (editTextPassword.getText().toString().trim().length() < 6) {
            editTextPassword.setError("Password more then 6 char");
            return false;
        }*/
        return true;
    }

    private void callLogin() {

        if (!isNetworkAvailable(this)) {

            goOfflineLogin();

            return;

        }
        Log.d("RESPONSE_LOGIN", "we are above progressdialog 163 sing_in_act");
        showProgressDialog("I am Authorising...");
        Log.d("RESPONSE_LOGIN", "callLogin called");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + LOGIN, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d("RESPONSE_LOGIN", "we are at 169 sing_in_act");
                parseLoginResponse(response);

                closeProgressDialog();

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
                Log.d("RESPONSE_LOGIN", "we are above progressdialog 180 sing_in_act");
                closeProgressDialog();
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {
                Log.d("RESPONSE_LOGIN", "callLogin called2");
                Map<String, String> params = new HashMap<String, String>();
                params.put(EMAIL_ADDRESS, editTextEmail.getText().toString().trim());
                params.put(PASSWORD, editTextPassword.getText().toString().trim());
                params.put(VDEVICETOKEN, "123123");
                params.put(EPLATFORM, "android");
                managerWagona.setStringDetail(PASSWORD, editTextPassword.getText().toString().trim());

                params = SecurityUtils.setSecureParams(params);
                return params;
            }

           /* @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String,String> params = new HashMap<String, String>();
                params.put("Content-Type","application/x-www-form-urlencoded");
                return params;
            }*/
        };


        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }

    private void parseLoginResponse(String response) {

        try {
            Log.d("RESPONSE_LOGIN", "we are at 212 sing_in_act");
            JSONObject mJsonObject = new JSONObject(response);

            Log.d("RESPONSE_LOGIN", response);

            if (mJsonObject.getInt(STATUS) == 1) {

                JSONObject mDetailsObj = mJsonObject.getJSONObject("school_id");

                /**
                 * Insert request and respose parameter for Offline use
                 * */

                mDatabasehelper.openDataBase();
                mDatabasehelper.insertUserInfo(mDetailsObj.getString(STUDENT_ID),
                        editTextEmail.getText().toString().trim(), editTextPassword.getText().toString().trim(), response);
                mDatabasehelper.close();

                managerWagona.setBooleanDetail(REMEMBER_ME, managerWagona.getBooleanDetail(REMEMBER_ME));

                //if (checkBoxRemember.isChecked()) {

                managerWagona.setStringDetail(STUDENT_ID, mDetailsObj.getString(STUDENT_ID));
                managerWagona.setStringDetail(ACCOUNT_ID, mDetailsObj.getString(ACCOUNT_ID));
                managerWagona.setStringDetail(FIRSTNAME, mDetailsObj.getString(FIRSTNAME));
                managerWagona.setStringDetail(SURNAME, mDetailsObj.getString(SURNAME));
                managerWagona.setStringDetail(USERNAME, mDetailsObj.getString(USERNAME));
                managerWagona.setStringDetail(PARENT_EMAIL, mDetailsObj.getString(PARENT_EMAIL));
                managerWagona.setStringDetail(PARENT_PHONE_NUM, mDetailsObj.getString(PARENT_PHONE_NUM));
                //this is subject id
                managerWagona.setStringDetail(CLASS_ID, mDetailsObj.getString(CLASS_ID));
                managerWagona.setStringDetail(VPROFILEIMAGE, mDetailsObj.getString(VPROFILEIMAGE));
                managerWagona.setStringDetail(CREATED_AT, mDetailsObj.getString(CREATED_AT));
                managerWagona.setStringDetail(UPDATED_AT, mDetailsObj.getString(UPDATED_AT));
                managerWagona.setStringDetail(RESULT, mDetailsObj.getString(RESULT));
                managerWagona.setStringDetail(IMAGEPATH, mDetailsObj.getString(IMAGEPATH));
                managerWagona.setStringDetail(VMOBILENUMBER, mDetailsObj.getString(VMOBILENUMBER));

                managerWagona.setStringDetail(COUNTRY_ID, mDetailsObj.getString(COUNTRY_ID));
                managerWagona.setStringDetail(SYLLABUS_ID, mDetailsObj.getString(SYLLABUS_ID));

                managerWagona.setStringDetail(PAYMENT_STATUS, mDetailsObj.getString(PAYMENT_STATUS));

                Log.d("RESPONSE_LOGIN: ", mDetailsObj.getString(PAYMENT_STATUS));
                Log.d("RESPONSE_LOGIN: ", String.valueOf(mDetailsObj));

                // }
                finish();
                Intent intent = new Intent(SignInActivity.this, HomeActivity.class);
                startActivity(intent);

            } else {
                Log.d("RESPONSE_LOGIN", "we are at 264 sing_in_act");
                // in api have to set same parameter name for messages
                showOkDialog(SignInActivity.this, mJsonObject.getString(MESSAGE));
            }


        } catch (Exception e) {
            Log.d("RESPONSE_LOGIN", "we are at 271 sing_in_act");
            e.printStackTrace();
        }
    }


    private void goOfflineLogin() {
        Log.d("RESPONSE_LOGIN", "we are at 278 sing_in_act");
        mDatabasehelper.openDataBase();

        String response = mDatabasehelper.isLogin(editTextEmail.getText().toString().trim(), editTextPassword.getText().toString().trim());

        mDatabasehelper.close();


        if (response.length() > 0) {
            parseLoginResponse(response);
        } else {
            showOkDialog(SignInActivity.this, "Authentication Error");
        }


    }


}
