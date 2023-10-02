package com.wagona.maths;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.wagona.maths.login.SignInActivity;

/**
 * Created by sotsys-159 on 15/4/16.
 */
public class PaySubscriptionActivity extends BaseActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pay_subcription);
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
        textHeader.setText("Subscribe");


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }


    private WebView webviewPay;
    private ProgressBar progressBar;

    private void initControls() {

        String url = getIntent().getStringExtra("URL");

        webviewPay = (WebView) findViewById(R.id.webviewPay);
        progressBar = (ProgressBar) findViewById(R.id.progressBar);

        webviewPay.setWebChromeClient(new WebChromeClient() {
            public void onProgressChanged(WebView view, int progress) {
                progressBar.setProgress(progress);
                if (progress == 100) {
                    progressBar.setVisibility(View.GONE);

                } else {
                    progressBar.setVisibility(View.VISIBLE);

                }
            }
        });

        WebSettings webSettings = webviewPay.getSettings();
        webSettings.setJavaScriptEnabled(true);

        webviewPay.setWebViewClient(new MyWebViewClient());
        webviewPay.loadUrl(url);
    }

    private class MyWebViewClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {


            return super.shouldOverrideUrlLoading(view, url);
        }


        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);



            /*if (url.contains("http://dev2.spaceo.in/project/wagona/site/payment_success")) {

            } else {*/
                /*if (!preApiCallChecking()) return;
                showProgressDialog("Loading...");*/
            //}

        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            //closeProgressDialog();

            Log.e("AMIT PAGE FINISHED","url: "+url);

            if (url.contains("https://wagona.com/site/payment_success")) {
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        loggedOut();
                    }
                }, 500);

            }
        }
    }



    private void loggedOut() {

        mDatabasehelper.openDataBase();
        mDatabasehelper.deleteAllTimeStamp();
        mDatabasehelper.close();

        managerWagona.clearAllSP();

        Intent intent = new Intent(PaySubscriptionActivity.this, SignInActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finishAffinity();
    }

}
