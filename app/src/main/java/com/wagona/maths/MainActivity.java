package com.wagona.maths;


import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.wagona.maths.Utils.Databasehelper;
import com.wagona.maths.login.SignInActivity;

import java.io.IOException;

public class MainActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
//        Mint.enableDebugLog();
        //to trace crash report, third party lib
//        Mint.initAndStartSession(MainActivity.this.getApplication(), "e11d689e");

        //CreateDatabase();


        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {

                if (managerWagona.getBooleanDetail(REMEMBER_ME)) {

                    Intent mIntent = new Intent(MainActivity.this, HomeActivity.class);
                    startActivity(mIntent);
                    finish();

                } else {
                    Intent mIntent = new Intent(MainActivity.this, SignInActivity.class);
                    startActivity(mIntent);
                    finish();

                }

            }
        }, 2000);

    }


    private void CreateDatabase() {

        Databasehelper myDbHelper;
        myDbHelper = new Databasehelper(MainActivity.this);

        try {
            myDbHelper.createDataBase();
        } catch (IOException ioe) {
            throw new Error("Unable to create database");
        }
        myDbHelper.close();


    }


}
