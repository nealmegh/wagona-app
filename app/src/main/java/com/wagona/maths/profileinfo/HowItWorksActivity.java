package com.wagona.maths.profileinfo;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.wagona.maths.BaseActivity;
import com.wagona.maths.HomeActivity;
import com.wagona.maths.R;

/**
 * Created by sotsys-159 on 15/4/16.
 */
public class HowItWorksActivity extends BaseActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_how_it_works);

        setScreenToolbar();
        initControls();
    }

    private void initControls() {

        TextView textletStart = (TextView) findViewById(R.id.textletStart);
        textletStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(HowItWorksActivity.this, HomeActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        });


    }


    private Toolbar toolbar;

    private void setScreenToolbar() {
        toolbar = (Toolbar) findViewById(R.id.headerStrip);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        textHeader.setText("How It Works");


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

}


