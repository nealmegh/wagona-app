package com.wagona.maths.profileinfo;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.wagona.maths.BaseActivity;
import com.wagona.maths.R;

/**
 * Created by sotsys-159 on 15/4/16.
 */
public class AboutUsActivity extends BaseActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about_us);
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
        textHeader.setText("About us");


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }


    private void initControls() {


    }
}
