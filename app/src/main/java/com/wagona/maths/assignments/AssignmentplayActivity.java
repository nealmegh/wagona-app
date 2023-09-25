package com.wagona.maths.assignments;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.text.Html;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.inputmethod.InputMethodManager;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wagona.maths.AppController;
import com.wagona.maths.BaseActivity;
import com.wagona.maths.CustomWebView;
import com.wagona.maths.R;
import com.wagona.maths.Utils.LogTag;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;
import com.wagona.maths.assignments.historyAssignment.AssignmentMarkTestActivity;
import com.wagona.maths.model.QuestionsBean;
import com.wagona.maths.widget.QuestionNumberBar;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Pattern;

/**
 * Created by sotsys-159 on 4/5/16.
 */
public class AssignmentplayActivity extends BaseActivity implements CustomWebView.KeyListener {

    private Toolbar toolbar;

    private ScrollView scrollViewHistory;
    private ImageView imageQuestion;
    private ImageView footerStrip;

    private RelativeLayout rlParent;
    private RelativeLayout layoutAnsA;
    private RelativeLayout layoutAnsB;
    private RelativeLayout layoutAnsC;
    private RelativeLayout layoutAnsD;
    private RelativeLayout layoutAnsE;

    private TextView txtTestTopicName;
    private TextView textArcTime;
    private TextView txtTestQuestion;

    private TextView txtOptA;
    private TextView txtOptB;
    private TextView txtOptC;
    private TextView txtOptD;
    private TextView txtOptE;

    private TextView txtAnsA;
    private TextView txtAnsB;
    private TextView txtAnsC;
    private TextView txtAnsD;
    private TextView txtAnsE;

    private TextView txtNext;

    private TextView textMarkTest;

    private QuestionNumberBar questioBar;

//    private ArcProgress arcTimer;

    private int CurrentDisplyQus = 0;

    /*
    * pre attached image path- Use to store path
    * */
    private String preFixImagePath;

    private WebView weviewQuestion, weviewAnsA, weviewAnsB, weviewAnsC, weviewAnsD, weviewAnsE;
    private CustomWebView weviewAnsFill;

    private List<QuestionsBean> mQuestionsBeanList = new ArrayList<>();
    private String testID;
    private LinearLayout llAnswerOption;

    private boolean flagRedirect = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_assignment_play);

        setScreenToolbar();
        initControls();

//        countDownTimer = new MyCountDownTimer(startTime, interval);

        // countDownTimer.cancel();
    }

    @Override
    protected void onPause() {
        super.onPause();
       /* if (countDownTimer != null)
            countDownTimer.cancel();*/
    }

//    private CountDownTimer countDownTimer;

    private final long startTime = 20 * 60 * 1000;
    private final long interval = 1 * 1000;

    @Override
    public void onSoftKeyClick() {
        if (getCurrentFocus() != null) {
            InputMethodManager inputMethodManager = (InputMethodManager) getSystemService(Activity.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
        }
        txtNext.performClick();
    }



    public class MyCountDownTimer extends CountDownTimer {
        public MyCountDownTimer(long startTime, long interval) {
            super(startTime, interval);
//            arcTimer.setMax(1200);
        }

        @Override
        public void onFinish() {

            showTimesUpDialog();

        }

        @Override
        public void onTick(long millisUntilFinished) {

//            arcTimer.setProgress((int) (millisUntilFinished / 1000));

            long minutes = millisUntilFinished / (60 * 1000);
            millisUntilFinished -= minutes * (60 * 1000);
            long seconds = millisUntilFinished / 1000;

            Log.e("TAG", "RUNNING: " + minutes + " ---- " + seconds);
            textArcTime.setText(minutes + " : " + seconds);


        }
    }

    private void setScreenToolbar() {
        toolbar = (Toolbar) findViewById(R.id.headerStrip);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        textHeader.setText(this.getIntent().getStringExtra("TITLE"));

        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                onBackPressed();


            }
        });
    }

    @Override
    public void onBackPressed() {

        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(AssignmentplayActivity.this);
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));
        alertDialogBuilder
                .setMessage("Are you sure you want to close this test?")
                .setCancelable(false)
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // redirect to test Explaination board.
                        /*if (countDownTimer != null) {
                            countDownTimer.cancel();
                        }*/
                        finish();
                    }
                })
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                    }
                });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();

    }


    private void initControls() {

        rlParent = (RelativeLayout) findViewById(R.id.rlParent);

        txtNext = (TextView) findViewById(R.id.txtNext);
        txtNext.setVisibility(View.GONE);

        llAnswerOption = (LinearLayout) findViewById(R.id.llAnswerOption);

        weviewAnsFill = (CustomWebView) findViewById(R.id.weviewAnsFill);
        weviewAnsFill.setListener(this, this);

        weviewAnsFill.getSettings().setJavaScriptEnabled(true);

        weviewQuestion = (WebView) findViewById(R.id.weviewQuestion);
        weviewQuestion.getSettings().setJavaScriptEnabled(true);

        weviewAnsA = (WebView) findViewById(R.id.weviewAnsA);
        weviewAnsA.getSettings().setJavaScriptEnabled(true);

        weviewAnsB = (WebView) findViewById(R.id.weviewAnsB);
        weviewAnsB.getSettings().setJavaScriptEnabled(true);

        weviewAnsC = (WebView) findViewById(R.id.weviewAnsC);
        weviewAnsC.getSettings().setJavaScriptEnabled(true);

        weviewAnsD = (WebView) findViewById(R.id.weviewAnsD);
        weviewAnsD.getSettings().setJavaScriptEnabled(true);

        weviewAnsE = (WebView) findViewById(R.id.weviewAnsE);
        weviewAnsE.getSettings().setJavaScriptEnabled(true);


//        arcTimer = (ArcProgress) findViewById(R.id.arcTimer);
        textArcTime = (TextView) findViewById(R.id.textArcTime);

        scrollViewHistory = (ScrollView) findViewById(R.id.scrollViewHistory);
        scrollViewHistory.setVisibility(View.GONE);
        imageQuestion = (ImageView) findViewById(R.id.imageQuestion);

        footerStrip = (ImageView) findViewById(R.id.footerStrip);

        layoutAnsA = (RelativeLayout) findViewById(R.id.layoutAnsA);
        layoutAnsB = (RelativeLayout) findViewById(R.id.layoutAnsB);
        layoutAnsC = (RelativeLayout) findViewById(R.id.layoutAnsC);
        layoutAnsD = (RelativeLayout) findViewById(R.id.layoutAnsD);
        layoutAnsE = (RelativeLayout) findViewById(R.id.layoutAnsE);

        txtTestTopicName = (TextView) findViewById(R.id.txtTestTopicName);

        txtTestQuestion = (TextView) findViewById(R.id.txtTestQuestion);
        txtOptA = (TextView) findViewById(R.id.txtOptA);
        txtAnsA = (TextView) findViewById(R.id.txtAnsA);
        txtOptB = (TextView) findViewById(R.id.txtOptB);
        txtAnsB = (TextView) findViewById(R.id.txtAnsB);
        txtOptC = (TextView) findViewById(R.id.txtOptC);
        txtAnsC = (TextView) findViewById(R.id.txtAnsC);
        txtOptD = (TextView) findViewById(R.id.txtOptD);
        txtAnsD = (TextView) findViewById(R.id.txtAnsD);
        txtOptE = (TextView) findViewById(R.id.txtOptE);
        txtAnsE = (TextView) findViewById(R.id.txtAnsE);
        textMarkTest = (TextView) findViewById(R.id.textMarkTest);

        textMarkTest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showMarkTestDialog();
            }
        });

        questioBar = (QuestionNumberBar) findViewById(R.id.questioBar);

        questioBar.setOnNumberClickListner(new QuestionNumberBar.OnNumberClickListner() {
            @Override
            public void onClickNumber(View mView, int position) {
                //here number identify question and View Identify which View clicked
                CurrentDisplyQus = position - 1;
//                Toast.makeText(getApplicationContext(), position+" - "+mQuestionsBeanList.size(), Toast.LENGTH_LONG).show();
                if (position > mQuestionsBeanList.size()){
                    try {
                        setQuestionDetails(mQuestionsBeanList.get(CurrentDisplyQus));
                    } catch (Exception e){
                        e.printStackTrace();
                    }
                } else {
                    try {
                        setQuestionDetails(mQuestionsBeanList.get(CurrentDisplyQus));
                    } catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        });

        callQuestionStuctureAPI(this.getIntent().getStringExtra("TOPIC_LIST"));

    }

        void setWirisEditor(final QuestionsBean questionDetails) {

            String startingTag = "<html style=\"width: 96%; height: 95%;\">\n" +
                    "    <head>\n" +
                    "<style type=\"text/css\">body{color: #319208;}</style>" +
                    "        <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"/>\n" +
                    "        <script type=\"text/javascript\" src=\"file:///android_asset/www/wiriseditor/viewer_offline.js\"></script>\n" +
                    "        <script type=\"text/javascript\" src=\"file:///android_asset/www/wiriseditor/editor_offline.js\"></script>\n" +
                    "    </head>\n" +
                    "    <body style=\"width: 100%; height: 100%\"><div id=\"editorContainer\" style=\"width: 100%; height: 100%;\">";

            String endingTag = "</div><script>\n" +
                    "           var viewer = new com.wiris.jsEditor.JsViewerMain('file:///android_asset/www/wiriseditor');\n" +
                    "           var editor = com.wiris.js.JsEditor.newInstance({basePath: 'file:///android_asset/www/wiriseditor','toolbarHidden':true});\n" +
                    "            editor.insertInto(document.getElementById('editorContainer'));\n" +
                    "        </script>\n" +
                    "    </body>\n" +
                    "</html>";




            try {
            File file = File.createTempFile("AnsFill.html", "", this.getCacheDir());
            FileOutputStream stream = new FileOutputStream(file);
            stream.write((startingTag + endingTag).getBytes());
            weviewAnsFill.setBackgroundColor(Color.TRANSPARENT);
            weviewAnsFill.loadUrl("file://" + file.getAbsolutePath());
        } catch (
                IOException e) {
            e.printStackTrace();
        }

            String test = questionDetails.getFillQuestion();

            String fillInQuestion = test.replace("<math", "<math wrs:positionable=\"false\"");
            fillInQuestion = fillInQuestion.replace("<mrow/>", "<mrow wrs:positionable=\"true\"/>");


            if (mQuestionsBeanList.get(CurrentDisplyQus).

                    getAnswerMathHtml() != null) {
                fillInQuestion = "editor.setMathML(\"" + mQuestionsBeanList.get(CurrentDisplyQus).getAnswerMathHtml().replace("\"", "\\\"") + "\")";
            } else {
                fillInQuestion = "editor.setMathML(\"" + fillInQuestion.replace("\"", "\\\"") + "\")";
            }

            final String finalFillInQuestion = fillInQuestion;

            LogTag.v("getAnswerMathHtml " + mQuestionsBeanList.get(CurrentDisplyQus).

                    getAnswerMathHtml());
            LogTag.v("finalFillInQuestion " + finalFillInQuestion);

            weviewAnsFill.setWebViewClient(new WebViewClient() {
                @Override
                public void onPageStarted(WebView view, String url, Bitmap favicon) {
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                        weviewAnsFill.evaluateJavascript(finalFillInQuestion, new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String value) {

                            }
                        });
                    }
                }
            });
    }

    public static String decodeUnicode(String myString) {
        Properties properties = new Properties();

        try {
            properties.load(new StringReader("key=" + myString.substring(1, myString.length() - 1)));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return properties.getProperty("key");
    }

    void setQuestion(final QuestionsBean questionDetails) {
        if (questionDetails.getQuest_image().length() == 0) {
            imageQuestion.setVisibility(View.GONE);
        } else {
            imageQuestion.setVisibility(View.VISIBLE);
            Glide.with(this).load(preFixImagePath + questionDetails.getQuest_image()).into(imageQuestion);

        }
        imageQuestion.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String mUrl = preFixImagePath + questionDetails.getQuest_image();

                DisplayMetrics displaymetrics = new DisplayMetrics();
                getWindowManager().getDefaultDisplay().getMetrics(displaymetrics);
                int height = displaymetrics.heightPixels;
                int width = displaymetrics.widthPixels;

                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(AssignmentplayActivity.this);
                LayoutInflater inflater = AssignmentplayActivity.this.getLayoutInflater();
                final View dialogView = inflater.inflate(R.layout.dialog_image_view, null);
                alertDialogBuilder.setView(dialogView);
                AlertDialog alertDialog = alertDialogBuilder.create();

                ImageView mImageView = (ImageView) dialogView.findViewById(R.id.imageQuestionFull);

                alertDialog.show();

                //                LinearLayout.LayoutParams mLayoutParams = new LinearLayout.LayoutParams((width - (width / 6)), (width - (width / 6)));
                //                mImageView.setLayoutParams(mLayoutParams);

                Glide.with(AssignmentplayActivity.this).load(mUrl).into(mImageView);
            }
        });


        txtTestTopicName.setText(removeScript(questionDetails.getTopic_description()));

        String startingTag = "<html style=\"width: 96%; height: 95%;\">\n" +
                "    <head>\n" +
                "<style type=\"text/css\">body{color: #319208;}</style>" +
                "        <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"/>\n" +
                "        <script type=\"text/javascript\" src=\"file:///android_asset/www/wiriseditor/viewer_offline.js\"></script>\n" +
                "    </head>\n" +
                "    <body style=\"width: 100%; height: 100%;\">";

        String endingTag = "<script>\n" +
                "            var viewer = new com.wiris.jsEditor.JsViewerMain('file:///android_asset/www/wiriseditor');\n" +
                "            viewer.run();\n" +
                "        </script>\n" +
                "    </body>\n" +
                "</html>";





        txtTestQuestion.setText(Html.fromHtml(questionDetails.getQuest_description()));
        ViewTreeObserver vto = txtTestQuestion.getViewTreeObserver();
        vto.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                txtTestQuestion.getViewTreeObserver().removeGlobalOnLayoutListener(this);
                int width = txtTestQuestion.getMeasuredWidth();
                int height = txtTestQuestion.getMeasuredHeight();

                LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) txtTestQuestion.getLayoutParams();
                params.height = height;
                txtTestQuestion.setLayoutParams(params);


            }
        });


        try {
            File file = File.createTempFile("question.html", "", this.getCacheDir());
            FileOutputStream stream = new FileOutputStream(file);
            stream.write((startingTag + questionDetails.getQuest_description() + endingTag).getBytes());
            weviewQuestion.setBackgroundColor(Color.TRANSPARENT);
            weviewQuestion.loadUrl("file://" + file.getAbsolutePath());
            txtTestQuestion.setVisibility(View.GONE);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /*_________________________________________________________check____________________________________________________________*/

    public void setQuestionDetails(final QuestionsBean questionDetails) {

        setQuestion(questionDetails);

        LogTag.v("Question Answer "+questionDetails.getQuestAnswer());

        if (questionDetails.getQuestionType() != null && questionDetails.getQuestionType().equals("fill")) {
            weviewAnsFill.setVisibility(View.VISIBLE);
            llAnswerOption.setVisibility(View.GONE);
            txtNext.setVisibility(View.VISIBLE);
            setWirisEditor(questionDetails);
        } else {
            weviewAnsFill.setVisibility(View.GONE);
            txtNext.setVisibility(View.GONE);
            llAnswerOption.setVisibility(View.VISIBLE);


            String startingTag = "<html style=\"width: 96%; height: 95%;\">\n" +
                    "    <head>\n" +
                    "<style type=\"text/css\">body{color: #319208;}</style>" +
                    "        <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"/>\n" +
                    "        <script type=\"text/javascript\" src=\"file:///android_asset/www/wiriseditor/viewer_offline.js\"></script>\n" +
                    "    </head>\n" +
                    "    <body style=\"width: 100%; height: 100%;\">";

            String endingTag = "<script>\n" +
                    "            var viewer = new com.wiris.jsEditor.JsViewerMain('file:///android_asset/www/wiriseditor');\n" +
                    "            viewer.run();\n" +
                    "        </script>\n" +
                    "    </body>\n" +
                    "</html>";


            try {
                File file = File.createTempFile("optiona.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextA() + endingTag).getBytes());
                weviewAnsA.setBackgroundColor(Color.TRANSPARENT);
                weviewAnsA.loadUrl("file://" + file.getAbsolutePath());
                txtAnsA.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = File.createTempFile("optionb.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextB() + endingTag).getBytes());
                weviewAnsB.setBackgroundColor(Color.TRANSPARENT);
                weviewAnsB.loadUrl("file://" + file.getAbsolutePath());
                txtAnsB.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = File.createTempFile("optionc.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextC() + endingTag).getBytes());
                weviewAnsC.setBackgroundColor(Color.TRANSPARENT);
                weviewAnsC.loadUrl("file://" + file.getAbsolutePath());
                txtAnsC.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = File.createTempFile("optiond.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextD() + endingTag).getBytes());
                weviewAnsD.setBackgroundColor(Color.TRANSPARENT);
                weviewAnsD.loadUrl("file://" + file.getAbsolutePath());
                txtAnsD.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = File.createTempFile("optiond.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextE() + endingTag).getBytes());
                weviewAnsE.setBackgroundColor(Color.TRANSPARENT);
                weviewAnsE.loadUrl("file://" + file.getAbsolutePath());
                txtAnsE.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            String PREFIX = "";
            String SUFIX = "";


            txtAnsA.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextA() + SUFIX));
            txtAnsB.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextB() + SUFIX));
            txtAnsC.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextC() + SUFIX));
            txtAnsD.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextD() + SUFIX));
            txtAnsE.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextE() + SUFIX));

        }


        makeSelectedAns(questionDetails.getAttendAns());


        /**
         * Set Text color and shape for Page numbers
         * */

        questioBar.txtPageNumber[CurrentDisplyQus].setTextColor(Color.WHITE);
        questioBar.txtPageNumber[CurrentDisplyQus].setBackgroundResource(R.drawable.qus_green_round_fill);

        setOtherPageNumberColor();


    }

    private void setOtherPageNumberColor() {

        for (int i = 0; i < mQuestionsBeanList.size(); i++) {
            if (i == CurrentDisplyQus) {
                continue;
            }

            if (mQuestionsBeanList.get(i).isAttend()) {

                questioBar.txtPageNumber[i].setTextColor(Color.WHITE);
                questioBar.txtPageNumber[i].setBackgroundResource(R.drawable.round_btn_blue);

            } else {
                questioBar.txtPageNumber[i].setTextColor(ContextCompat.getColor(AssignmentplayActivity.this, R.color.colorPrimaryDark));
                questioBar.txtPageNumber[i].setBackgroundResource(R.drawable.qus_green_round_border);
            }

        }
    }

    private void setAnsClickListner() {
        layoutAnsA.setOnClickListener(mAnsListner);
        layoutAnsB.setOnClickListener(mAnsListner);
        layoutAnsC.setOnClickListener(mAnsListner);
        layoutAnsD.setOnClickListener(mAnsListner);
        layoutAnsE.setOnClickListener(mAnsListner);
        txtNext.setOnClickListener(mAnsListner);
    }

    View.OnClickListener mAnsListner = new View.OnClickListener() {
        @Override
        public void onClick(View v) {


            if (v.getId() == R.id.layoutAnsA) {

                if (mQuestionsBeanList.get(CurrentDisplyQus).isAttend() && mQuestionsBeanList.get(CurrentDisplyQus).getAttendAns().equalsIgnoreCase("A")) {
                    makeSelectedAns("X");
                    setOtherPageNumberColor();
                    flagRedirect = false;
                } else {
                    flagRedirect = true;
                    makeSelectedAns("A");
                }


            } else if (v.getId() == R.id.layoutAnsB) {

                if (mQuestionsBeanList.get(CurrentDisplyQus).isAttend() && mQuestionsBeanList.get(CurrentDisplyQus).getAttendAns().equalsIgnoreCase("B")) {
                    makeSelectedAns("X");
                    setOtherPageNumberColor();
                    flagRedirect = false;
                } else {
                    flagRedirect = true;
                    makeSelectedAns("B");
                }

                //makeSelectedAns("B");

            } else if (v.getId() == R.id.layoutAnsC) {

                if (mQuestionsBeanList.get(CurrentDisplyQus).isAttend() && mQuestionsBeanList.get(CurrentDisplyQus).getAttendAns().equalsIgnoreCase("C")) {
                    makeSelectedAns("X");
                    setOtherPageNumberColor();
                    flagRedirect = false;
                } else {
                    flagRedirect = true;
                    makeSelectedAns("C");
                }
                //makeSelectedAns("C");

            } else if (v.getId() == R.id.layoutAnsD) {

                if (mQuestionsBeanList.get(CurrentDisplyQus).isAttend() && mQuestionsBeanList.get(CurrentDisplyQus).getAttendAns().equalsIgnoreCase("D")) {
                    makeSelectedAns("X");
                    setOtherPageNumberColor();
                    flagRedirect = false;
                } else {
                    flagRedirect = true;
                    makeSelectedAns("D");
                }
                //makeSelectedAns("D");

            } else if (v.getId() == R.id.layoutAnsE) {
                if (mQuestionsBeanList.get(CurrentDisplyQus).isAttend() && mQuestionsBeanList.get(CurrentDisplyQus).getAttendAns().equalsIgnoreCase("E")) {
                    makeSelectedAns("X");
                    setOtherPageNumberColor();
                    flagRedirect = false;
                } else {
                    flagRedirect = true;
                    makeSelectedAns("E");
                }
                //makeSelectedAns("E");

            } else if (v.equals(txtNext)) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    weviewAnsFill.evaluateJavascript("editor.getMathML()", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {
                            value = decodeUnicode(value);     // The result comes with special XML characters encoded, such as <, " and &. We need to decode them before displaying the result.
                            LogTag.v("evaluateJavascript " + value);
                            LogTag.v("CurrentDisplyQus " + CurrentDisplyQus);

                            value = value.replace("&#xA0;", "&#x000A0;");
                            value = value.replace("<mspace linebreak=\"newline\"/>", ""); // Removing next line, if clicked soft keyboard imeOption.

                            if (mQuestionsBeanList.get(CurrentDisplyQus).isAttend() && mQuestionsBeanList.get(CurrentDisplyQus).getAttendAns().equalsIgnoreCase("X")) {
                                makeSelectedAns("X");
                                setOtherPageNumberColor();
                                flagRedirect = false;
                            } else {
                                flagRedirect = true;
                                makeSelectedAns("FILL");
                            }

                            mQuestionsBeanList.get(CurrentDisplyQus).setAnswerMathHtml(value);
                            shouldGoNext(flagRedirect);
                            return;
                        }
                    });
                }
            }


            if (!v.equals(txtNext)) {
                shouldGoNext(flagRedirect);
            }
        }
    };

    void shouldGoNext(boolean flagRedirect) {

        LogTag.v("shouldGoNext ");

        if (flagRedirect) {
            CurrentDisplyQus = CurrentDisplyQus + 1;
            if (CurrentDisplyQus < mQuestionsBeanList.size()) {
                setQuestionDetails(mQuestionsBeanList.get(CurrentDisplyQus));
            } else {
                CurrentDisplyQus--;
                showLastQuestionDialog();
            }
        }
    }

    private void showLastQuestionDialog() {

        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(AssignmentplayActivity.this);
        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));
        // set dialog message
        alertDialogBuilder
                .setMessage("This was the last question. Proceed to")
                .setCancelable(false)
                .setPositiveButton("Mark the Test", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // redirect to test Explaination board.
                        callMarkTestAPI();
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // Put this on same page

                    }
                });

        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();


    }

    /**
     * Mark test dialog to submit app on server or close Test
     */
    private void showMarkTestDialog() {

        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(AssignmentplayActivity.this);
        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));
        // set dialog message
        alertDialogBuilder
                .setMessage(getString(R.string.test_end_msg))
                .setCancelable(false)
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // redirect to test Explaination board.
                        callMarkTestAPI();
                    }
                })
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // Put this on same page

                    }
                });

        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();


    }

    /**
     * show times up dialog
     */
    private void showTimesUpDialog() {

        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(AssignmentplayActivity.this);
        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));
        // set dialog message
        alertDialogBuilder
                .setMessage("Times up,You have reached the time limit set for the Test. Continue to view your result.")
                .setCancelable(false)
                .setPositiveButton("Continue", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // redirect to test Explaination board.

                        callMarkTestAPI();

                    }
                });
        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();
        // show it
        alertDialog.show();


    }


    private void clearOldRecordAns() {

        mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("X");
        mQuestionsBeanList.get(CurrentDisplyQus).setAttend(false);

        txtOptA.setBackgroundResource(R.drawable.ans_btn_click);
        txtOptA.setTextColor(ContextCompat.getColor(this, R.color.dark_font));

        txtOptB.setBackgroundResource(R.drawable.ans_btn_click);
        txtOptB.setTextColor(ContextCompat.getColor(this, R.color.dark_font));

        txtOptC.setBackgroundResource(R.drawable.ans_btn_click);
        txtOptC.setTextColor(ContextCompat.getColor(this, R.color.dark_font));

        txtOptD.setBackgroundResource(R.drawable.ans_btn_click);
        txtOptD.setTextColor(ContextCompat.getColor(this, R.color.dark_font));

        txtOptE.setBackgroundResource(R.drawable.ans_btn_click);
        txtOptE.setTextColor(ContextCompat.getColor(this, R.color.dark_font));

    }

    private void makeSelectedAns(String ans) {

        clearOldRecordAns();

        if (ans.equalsIgnoreCase("A")) {
            txtOptA.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptA.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("a");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);

        } else if (ans.equalsIgnoreCase("B")) {

            txtOptB.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptB.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("b");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        } else if (ans.equalsIgnoreCase("C")) {

            txtOptC.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptC.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("c");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        } else if (ans.equalsIgnoreCase("D")) {

            txtOptD.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptD.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("d");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        } else if (ans.equalsIgnoreCase("E")) {
            txtOptE.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptE.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("e");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        } else if (ans.equalsIgnoreCase("FILL")) {
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("FILL");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        }


    }


    private String removeScript(String content) {
        Pattern p = Pattern.compile("[0-9]+.",
                Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
        return p.matcher(content).replaceAll("");
    }


    /**
     * API call to get all data from server about 10 Questions and options
     * It will run with time and disply
     *
     * @param topic_list
     */
    private void callQuestionStuctureAPI(final String topic_list) {

        Log.e("TOPIC", topic_list + "----" + managerWagona.getStringDetail(STUDENT_ID));

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + TAKE_ASSIGMENTS, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d("RESPONSE: ", response);
                try {
                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        Gson gson = new Gson();
                        Type listType = new TypeToken<List<QuestionsBean>>() {
                        }.getType();
                        mQuestionsBeanList = (List<QuestionsBean>) gson.fromJson(new JSONObject(response).getJSONObject("assignment").getString("questions"), listType);

                        scrollViewHistory.setVisibility(View.VISIBLE);

                        preFixImagePath = /*new JSONObject(response).getJSONObject("assignment").getString("image_path")*/"https://wagona.com/admin/data/test_quest/";
                        testID = new JSONObject(response).getJSONObject("assignment").getJSONObject("header").getString("id");

                        CurrentDisplyQus = 0;
                        setAnsClickListner();
                        setQuestionDetails(mQuestionsBeanList.get(0));
//                        countDownTimer.start();

                    } else {
                        showOkDialog(AssignmentplayActivity.this, mJsonObject.getString(MESSAGE));
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
                params.put(HEADER_ID, AssignmentplayActivity.this.getIntent().getStringExtra("HEARDER_ID"));
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));
                params = SecurityUtils.setSecureParams(params);
               /* params.put(TOPIC_ID, "673_674_679_682_685");
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));
                params = SecurityUtils.setSecureParams(params);*/
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

    private void showRetryDialog(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                AssignmentplayActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callQuestionStuctureAPI(AssignmentplayActivity.this.getIntent().getStringExtra("TOPIC_LIST"));

                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        finish();
                    }
                });

        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();


    }

    /**
     * Submit all attended and to Server with api
     */

    private void callMarkTestAPI() {


        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");


        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + ASSIGNMENT_SUBMIT, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                try {
                    JSONObject mJsonObject = new JSONObject(response);
                    //{"success":true,"testid":"2013"}

                    if (mJsonObject.getInt("status") == 1) {

//                        testID = mJsonObject.getString("testid");

                        Intent intent = new Intent(AssignmentplayActivity.this, AssignmentMarkTestActivity.class);
                        intent.putExtra("test_id", AssignmentplayActivity.this.getIntent().getStringExtra("HEARDER_ID"));
                        intent.putExtra("TITLE", AssignmentplayActivity.this.getIntent().getStringExtra("TITLE"));
                        startActivity(intent);
                        finish();

                    } else {
                        showOkDialog(AssignmentplayActivity.this, mJsonObject.getString(MESSAGE));
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
                    showRetryDialogMark(error.toString());
                }
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {
                Log.d("RESPONSE: ", generateJsonArray());
                Map<String, String> params = new HashMap<String, String>();
                /*params.put("testid", testID);
                params.put(STUDENT_ID, managerWagona.getStringDetail(STUDENT_ID));
                params.put(SUBJECT_ID, AssignmentplayActivity.this.getIntent().getStringExtra(SUBJECT_ID));
                params.put("data", generateJsonArray());*/

                params.put(HEADER_ID, AssignmentplayActivity.this.getIntent().getStringExtra("HEARDER_ID"));
//                params.put(STUDENT_ID, managerWagona.getStringDetail(STUDENT_ID));
//                params.put(SUBJECT_ID, AssignmentplayActivity.this.getIntent().getStringExtra(SUBJECT_ID));
                params.put("data", generateJsonArray());

                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);

    }


    private void showRetryDialogMark(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                AssignmentplayActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callMarkTestAPI();

                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        finish();
                    }
                });

        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();


    }


    /**
     * Make array from ans by user according to questions
     */

    private String generateJsonArray() {

        try {

            JSONArray mJsonArray = new JSONArray();
            for (int i = 0; i < mQuestionsBeanList.size(); i++) {
                JSONObject mJsonObject = new JSONObject();
                mJsonObject.put("0", mQuestionsBeanList.get(i).getQuestion_id());

                if (mQuestionsBeanList.get(i).getAttendAns().equalsIgnoreCase("FILL")){
                    mJsonObject.put("1", mQuestionsBeanList.get(i).getAnswerMathHtml());
                }else {
                    mJsonObject.put("1", mQuestionsBeanList.get(i).getAttendAns());
                }
                mJsonArray.put(mJsonObject);
            }
            return mJsonArray.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


}
