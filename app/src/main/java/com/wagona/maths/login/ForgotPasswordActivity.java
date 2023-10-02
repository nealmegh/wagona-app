package com.wagona.maths.login;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
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
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by sotsys-159 on 12/4/16.
 */
public class ForgotPasswordActivity extends BaseActivity {

    Toolbar toolbar;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_pass);

        toolbar = (Toolbar) findViewById(R.id.headerStrip);
        setSupportActionBar(toolbar);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("");


        initControls();

    }


    private EditText editTextEmail;
    private TextView textBtnSubmit;

    private void initControls() {



        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        TextView textHeader = (TextView) findViewById(R.id.textHeader);
        textHeader.setText("Forgot Details");

        editTextEmail=(EditText)findViewById(R.id.editTextEmail);

        textBtnSubmit=(TextView)findViewById(R.id.textBtnSubmit);

        textBtnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if(isValidate()){
                    callForgotPasswordApi();
                }

            }
        });

        (findViewById(R.id.signUpRedirectLayout)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //sign up screen

                Intent intent = new Intent(ForgotPasswordActivity.this, SignUpActivity.class);
                startActivity(intent);


            }
        });


    }

    private void callForgotPasswordApi() {

        if(!preApiCallChecking())return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl()+FORGOT_PASSWORD, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                try{
                    JSONObject mJsonObject=new JSONObject(response);
                    showOkDialogClose(ForgotPasswordActivity.this,mJsonObject.getString(MESSAGE));

                }catch (Exception e){
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
                params.put(EMAIL, editTextEmail.getText().toString().trim());
                params= SecurityUtils.setSecureParams(params);
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


    public boolean isValidate() {

        if (editTextEmail.getText().toString().trim().length() == 0) {
            editTextEmail.setError(getString(R.string.valid_email_address));
            return false;
        } /*else if (!isValidEmail(editTextEmail.getText().toString().trim())) {
            editTextEmail.setError(getString(R.string.valid_email_pattern));
            return false;
        }*/
        return true;
    }
}
