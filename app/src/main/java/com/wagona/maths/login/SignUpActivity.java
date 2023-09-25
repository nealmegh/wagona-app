package com.wagona.maths.login;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.wagona.maths.BaseActivity;
import com.wagona.maths.R;

/**
 * Created by sotsys-159 on 12/4/16.
 */
public class SignUpActivity extends BaseActivity {


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);
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
        textHeader.setText("Sign Up");


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }


    private LinearLayout alreadyAccount;
    private LinearLayout createAccount;
    private LinearLayout registerSchool;

    private void initControls() {



        alreadyAccount = (LinearLayout) findViewById(R.id.alreadyAccount);
        alreadyAccount.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        createAccount = (LinearLayout) findViewById(R.id.createAccount);
        createAccount.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(SignUpActivity.this, CreateAccountActivity.class);
                startActivity(intent);


            }
        });

        registerSchool = (LinearLayout) findViewById(R.id.registerSchool);
        registerSchool.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(SignUpActivity.this, RegisterSchoolActivity.class);
                startActivity(intent);

            }
        });

    }


}
