package com.wagona.maths.assignments.historyAssignment;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.text.Html;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewTreeObserver;
import android.webkit.WebView;
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
import com.wagona.maths.HomeActivity;
import com.wagona.maths.R;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;
import com.wagona.maths.custom.ArcProgress;
import com.wagona.maths.model.QuestionsBean;
import com.wagona.maths.model.QuizHeaderBean;
import com.wagona.maths.widget.QuestionNumberBar;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Created by sotsys-159 on 4/5/16.
 */
public class AssignmentMarkTestActivity extends BaseActivity {


    private ScrollView scrollViewHistory;
    private ImageView imageQuestion;

    private RelativeLayout layoutAnsA;
    private RelativeLayout layoutAnsB;
    private RelativeLayout layoutAnsC;
    private RelativeLayout layoutAnsD;
    private RelativeLayout layoutAnsE;

    private TextView txtTestTopicName;

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

    private ImageView imgA;
    private ImageView imgB;
    private ImageView imgC;
    private ImageView imgD;
    private ImageView imgE;


    private TextView textDashBoard;
    private TextView textExplanation;

    private QuestionNumberBar questioBar;


    private int CurrentDisplyQus = 0;

    /*
    * pre attached image path- Use to store path
    * */
    private String preFixImagePath = "http://demo.spaceotechnologies.com/wagona/admin/data/test_quest/";


    private ArcProgress arcTimer;
    private TextView textPercent;
    private TextView textLable;

    private WebView weviewQuestion, weviewOptA, weviewOptB, weviewOptC, weviewOptD, weviewOptE;

    private LinearLayout llAnswerOption, llCorrectAnswer;
    private WebView weviewYourAnswerFill,weviewCorrectAnswerFill;
    private ImageView ivYourAnswerStatus;

    private List<QuestionsBean> mQuestionsBeanList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mark_test_1);

        setScreenToolbar();
        initControls();

    }

    private void setScreenToolbar() {

        toolbar = (Toolbar) findViewById(R.id.headerStrip);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        textHeader.setText("Mark Assignment");
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();

            }
        });
    }


    private void initControls() {


        llAnswerOption = (LinearLayout) findViewById(R.id.llAnswerOption);
        llCorrectAnswer = (LinearLayout) findViewById(R.id.llCorrectAnswer);
        ivYourAnswerStatus = (ImageView) findViewById(R.id.ivYourAnswerStatus);

        weviewYourAnswerFill = (WebView) findViewById(R.id.weviewYourAnswerFill);
        weviewYourAnswerFill.getSettings().setJavaScriptEnabled(true);

        weviewCorrectAnswerFill= (WebView) findViewById(R.id.weviewCorrectAnswerFill);
        weviewCorrectAnswerFill.getSettings().setJavaScriptEnabled(true);

        weviewQuestion = (WebView) findViewById(R.id.weviewQuestion);
        weviewQuestion.getSettings().setJavaScriptEnabled(true);

        weviewOptA = (WebView) findViewById(R.id.weviewOptA);
        weviewOptA.getSettings().setJavaScriptEnabled(true);

        weviewOptB = (WebView) findViewById(R.id.weviewOptB);
        weviewOptB.getSettings().setJavaScriptEnabled(true);

        weviewOptC = (WebView) findViewById(R.id.weviewOptC);
        weviewOptC.getSettings().setJavaScriptEnabled(true);

        weviewOptD = (WebView) findViewById(R.id.weviewOptD);
        weviewOptD.getSettings().setJavaScriptEnabled(true);

        weviewOptE = (WebView) findViewById(R.id.weviewOptE);
        weviewOptE.getSettings().setJavaScriptEnabled(true);

        textDashBoard = (TextView) findViewById(R.id.textDashBoard);

        textDashBoard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(AssignmentMarkTestActivity.this, HomeActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);

            }
        });

        textExplanation = (TextView) findViewById(R.id.textExplanation);

        textExplanation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                showInformationDialog();

            }
        });

        arcTimer = (ArcProgress) findViewById(R.id.arcTimer);
        textPercent = (TextView) findViewById(R.id.textPercent);
        textLable = (TextView) findViewById(R.id.textLable);

        scrollViewHistory = (ScrollView) findViewById(R.id.scrollViewHistory);
        scrollViewHistory.setVisibility(View.GONE);
        imageQuestion = (ImageView) findViewById(R.id.imageQuestion);

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


        imgA = (ImageView) findViewById(R.id.imgA);
        imgB = (ImageView) findViewById(R.id.imgB);
        imgC = (ImageView) findViewById(R.id.imgC);
        imgD = (ImageView) findViewById(R.id.imgD);
        imgE = (ImageView) findViewById(R.id.imgE);

        imgA.setVisibility(View.INVISIBLE);
        imgB.setVisibility(View.INVISIBLE);
        imgC.setVisibility(View.INVISIBLE);
        imgD.setVisibility(View.INVISIBLE);
        imgE.setVisibility(View.INVISIBLE);

        questioBar = (QuestionNumberBar) findViewById(R.id.questioBar);

        questioBar.setOnNumberClickListner(new QuestionNumberBar.OnNumberClickListner() {
            @Override
            public void onClickNumber(View mView, int position) {
                //here number identify question and View Identify which View clicked
                CurrentDisplyQus = position - 1;

                if (CurrentDisplyQus >= mQuestionsBeanList.size()){
                    return;
                }

                setQuestionDetails(mQuestionsBeanList.get(CurrentDisplyQus));
            }
        });


        mDatabasehelper.openDataBase();
        boolean isAvailable = mDatabasehelper.checkForTestIDinDetailsAssignment(this.getIntent().getStringExtra("test_id"));
        mDatabasehelper.close();


        if (!isAvailable) {
            callTestDetailsAPI(this.getIntent().getStringExtra("test_id"));
        } else {
            showDetailsFromLocal(this.getIntent().getStringExtra("test_id"));
        }


    }

    private void showInformationDialog() {

        android.app.AlertDialog.Builder dialogBuilder = new android.app.AlertDialog.Builder(this, R.style.MyAlertDialogTheme);
        LayoutInflater inflater = this.getLayoutInflater();
        final View dialogView = inflater.inflate(R.layout.dialog_explaination, null);
        dialogBuilder.setView(dialogView);
        android.app.AlertDialog b = dialogBuilder.create();
        b.show();

        TextView txtRightAns = (TextView) dialogView.findViewById(R.id.txtRightAns);
        TextView textAnsContent = (TextView) dialogView.findViewById(R.id.textAnsContent);
        TextView textContent = (TextView) dialogView.findViewById(R.id.textContent);

        WebView weviewAnsContent = (WebView) dialogView.findViewById(R.id.weviewAnsContent);
        weviewAnsContent.getSettings().setJavaScriptEnabled(true);

        WebView weviewContent = (WebView) dialogView.findViewById(R.id.weviewContent);
        weviewContent.getSettings().setJavaScriptEnabled(true);

        String rightAnswer = "";

        /*if (mQuestionsBeanList.get(CurrentDisplyQus).getQuestionType() != null && mQuestionsBeanList.get(CurrentDisplyQus).getQuestionType().equals("fill")) {
            txtRightAns.setVisibility(View.GONE);
        } else {
            txtRightAns.setVisibility(View.VISIBLE);
        }*/
        //textContactAddress.setText(mSocialLinkList.get(5).toString());

        txtRightAns.setText(mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer().toUpperCase() + "");

        if (mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer().equalsIgnoreCase("a")) {

            rightAnswer = mQuestionsBeanList.get(CurrentDisplyQus).getOptionTextA() + "";

        } else if (mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer().equalsIgnoreCase("b")) {

            rightAnswer = mQuestionsBeanList.get(CurrentDisplyQus).getOptionTextB() + "";

        } else if (mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer().equalsIgnoreCase("c")) {

            rightAnswer = mQuestionsBeanList.get(CurrentDisplyQus).getOptionTextC() + "";

        } else if (mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer().equalsIgnoreCase("d")) {

            rightAnswer = mQuestionsBeanList.get(CurrentDisplyQus).getOptionTextD() + "";

        } else if (mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer().equalsIgnoreCase("e")) {

            rightAnswer = mQuestionsBeanList.get(CurrentDisplyQus).getOptionTextE() + "";

        }

        textAnsContent.setText(Html.fromHtml(rightAnswer));

        String startingTag = "<html style=\"width: 96%; height: 95%;\">\n" +
                "    <head>\n" +
                "<style type=\"text/css\">body{color: #56666B;}</style>" +
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
            File file = File.createTempFile("ansContent.html", "", this.getCacheDir());
            FileOutputStream stream = new FileOutputStream(file);
            stream.write((startingTag + rightAnswer + endingTag).getBytes());
            weviewAnsContent.setBackgroundColor(Color.TRANSPARENT);
            weviewAnsContent.loadUrl("file://" + file.getAbsolutePath());
            textAnsContent.setVisibility(View.GONE);
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            File file = File.createTempFile("ansDetailContent.html", "", this.getCacheDir());
            FileOutputStream stream = new FileOutputStream(file);
            stream.write((startingTag + mQuestionsBeanList.get(CurrentDisplyQus).getMiscon() + endingTag).getBytes());
            weviewContent.setBackgroundColor(Color.TRANSPARENT);
            weviewContent.loadUrl("file://" + file.getAbsolutePath());
            textContent.setVisibility(View.GONE);
        } catch (IOException e) {
            e.printStackTrace();
        }


        textContent.setText(Html.fromHtml(mQuestionsBeanList.get(CurrentDisplyQus).getMiscon()));


    }


    public void setHeaderData(final QuizHeaderBean headerData) {

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                arcTimer.setProgress(headerData.getScore_percent());
            }
        }, 500);


        textPercent.setText(headerData.getScore_percent() + "%");

        if (headerData.getScore_percent() == 0) {

            arcTimer.setFinishedStrokeColor(ContextCompat.getColor(this, R.color.arc_gray));
            textPercent.setTextColor(ContextCompat.getColor(this, R.color.dark_font));
            textLable.setTextColor(ContextCompat.getColor(this, R.color.dark_font));

        } else if (headerData.getScore_percent() > 0 && headerData.getScore_percent() <= 50) {

            arcTimer.setFinishedStrokeColor(ContextCompat.getColor(this, R.color.arc_red));
            textPercent.setTextColor(ContextCompat.getColor(this, R.color.arc_red));
            textLable.setTextColor(ContextCompat.getColor(this, R.color.arc_red));

        } else if (headerData.getScore_percent() > 50 && headerData.getScore_percent() < 75) {


            arcTimer.setFinishedStrokeColor(ContextCompat.getColor(this, R.color.arc_orange));

            textPercent.setTextColor(ContextCompat.getColor(this, R.color.arc_orange));
            textLable.setTextColor(ContextCompat.getColor(this, R.color.arc_orange));

        } else if (headerData.getScore_percent() >= 75) {

            arcTimer.setFinishedStrokeColor(ContextCompat.getColor(this, R.color.colorPrimaryDark));

            textPercent.setTextColor(ContextCompat.getColor(this, R.color.colorPrimaryDark));
            textLable.setTextColor(ContextCompat.getColor(this, R.color.colorPrimaryDark));

        }
    }

    private Toolbar toolbar;

    void setQuestion(final QuestionsBean questionDetails) {

        try {
            txtTestTopicName.setText(removeScript(questionDetails.getTopic_description()));
        } catch (Exception e) {
            e.printStackTrace();
        }

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

                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(AssignmentMarkTestActivity.this);
                LayoutInflater inflater = AssignmentMarkTestActivity.this.getLayoutInflater();
                final View dialogView = inflater.inflate(R.layout.dialog_image_view, null);
                alertDialogBuilder.setView(dialogView);
                AlertDialog alertDialog = alertDialogBuilder.create();

                ImageView mImageView = (ImageView) dialogView.findViewById(R.id.imageQuestionFull);

                alertDialog.show();

//                LinearLayout.LayoutParams mLayoutParams = new LinearLayout.LayoutParams((width - (width / 6)), (width - (width / 6)));
//                mImageView.setLayoutParams(mLayoutParams);

                Glide.with(AssignmentMarkTestActivity.this).load(mUrl).into(mImageView);
            }
        });

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
            File file = File.createTempFile("question.html", "", this.getCacheDir());
            FileOutputStream stream = new FileOutputStream(file);
            stream.write((startingTag + questionDetails.getQuest_description() + endingTag).getBytes());
            weviewQuestion.setBackgroundColor(Color.TRANSPARENT);
            weviewQuestion.loadUrl("file://" + file.getAbsolutePath());
            txtTestQuestion.setVisibility(View.GONE);
        } catch (IOException e) {
            e.printStackTrace();
        }

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
    }


    public void setQuestionDetails(final QuestionsBean questionDetails) {

        setQuestion(questionDetails);

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


        llCorrectAnswer.setVisibility(View.GONE);

        if (questionDetails.getQuestionType() != null && questionDetails.getQuestionType().equals("fill")) {
            weviewYourAnswerFill.setVisibility(View.VISIBLE);
            llAnswerOption.setVisibility(View.GONE);
            //setWirisEditor(questionDetails);
            ivYourAnswerStatus.setVisibility(View.VISIBLE);

            try {
                File file = File.createTempFile("optiona.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getUserAnswer() + endingTag).getBytes());
                weviewYourAnswerFill.setBackgroundColor(Color.TRANSPARENT);
                weviewYourAnswerFill.loadUrl("file://" + file.getAbsolutePath());
            } catch (IOException e) {
                e.printStackTrace();
            }

            if (questionDetails.getQuestAnswer().equalsIgnoreCase(questionDetails.getUserAnswer())) {
                ivYourAnswerStatus.setImageResource(R.drawable.right_sign);
            } else {
                ivYourAnswerStatus.setImageResource(R.drawable.wrong_sign);

                llCorrectAnswer.setVisibility(View.VISIBLE);

                try {
                    File file = File.createTempFile("correct_answer.html", "", this.getCacheDir());
                    FileOutputStream stream = new FileOutputStream(file);
                    stream.write((startingTag + questionDetails.getQuestAnswer() + endingTag).getBytes());
                    weviewCorrectAnswerFill.setBackgroundColor(Color.TRANSPARENT);
                    weviewCorrectAnswerFill.loadUrl("file://" + file.getAbsolutePath());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        } else {

            ivYourAnswerStatus.setVisibility(View.GONE);
            weviewYourAnswerFill.setVisibility(View.GONE);
            llAnswerOption.setVisibility(View.VISIBLE);

            imgA.setVisibility(View.INVISIBLE);
            imgB.setVisibility(View.INVISIBLE);
            imgC.setVisibility(View.INVISIBLE);
            imgD.setVisibility(View.INVISIBLE);
            imgE.setVisibility(View.INVISIBLE);


            String PREFIX = "";
            String SUFIX = "";


            txtAnsA.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextA() + SUFIX));
            //txtAnsA.setText(Html.fromHtml("<sup>1</sup>&frasl;<sub>10</sub>"));

            try {
                File file = File.createTempFile("optiona.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextA() + endingTag).getBytes());
                weviewOptA.setBackgroundColor(Color.TRANSPARENT);
                weviewOptA.loadUrl("file://" + file.getAbsolutePath());
                txtAnsA.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = File.createTempFile("optionb.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextB() + endingTag).getBytes());
                weviewOptB.setBackgroundColor(Color.TRANSPARENT);
                weviewOptB.loadUrl("file://" + file.getAbsolutePath());
                txtAnsB.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = File.createTempFile("optionc.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextC() + endingTag).getBytes());
                weviewOptC.setBackgroundColor(Color.TRANSPARENT);
                weviewOptC.loadUrl("file://" + file.getAbsolutePath());
                txtAnsC.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = File.createTempFile("optiond.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextD() + endingTag).getBytes());
                weviewOptD.setBackgroundColor(Color.TRANSPARENT);
                weviewOptD.loadUrl("file://" + file.getAbsolutePath());
                txtAnsD.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = File.createTempFile("optiond.html", "", this.getCacheDir());
                FileOutputStream stream = new FileOutputStream(file);
                stream.write((startingTag + questionDetails.getOptionTextE() + endingTag).getBytes());
                weviewOptE.setBackgroundColor(Color.TRANSPARENT);
                weviewOptE.loadUrl("file://" + file.getAbsolutePath());
                txtAnsE.setVisibility(View.GONE);
            } catch (IOException e) {
                e.printStackTrace();
            }


            txtAnsB.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextB() + SUFIX));
            txtAnsC.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextC() + SUFIX));
            txtAnsD.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextD() + SUFIX));
            txtAnsE.setText(Html.fromHtml(PREFIX + questionDetails.getOptionTextE() + SUFIX));
        }

        clearOldRecordAns();

        /**
         * Set Text color and shape for Page numbers
         * */
        if (mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer().equalsIgnoreCase(questionDetails.getUserAnswer())) {

            questioBar.txtPageNumber[CurrentDisplyQus].setTextColor(Color.WHITE);
            questioBar.txtPageNumber[CurrentDisplyQus].setBackgroundResource(R.drawable.select_que_green);

        } else {
            questioBar.txtPageNumber[CurrentDisplyQus].setTextColor(Color.WHITE);
            questioBar.txtPageNumber[CurrentDisplyQus].setBackgroundResource(R.drawable.select_que);
        }


        setOtherPageNumberColor();

        makeSelectedAns(questionDetails.getUserAnswer().toUpperCase());


        //set sign to show and is right or not, if right then show right icon, if wrong then show wrong and right ans both

        if (mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer().equalsIgnoreCase(questionDetails.getUserAnswer())) {
            //show only right_sign beside correct and other are hidden
            showRightSignOnly(questionDetails.getUserAnswer());

        } else {
            //show right and wrong icon both
            showRightSignWrongSignBoth(mQuestionsBeanList.get(CurrentDisplyQus).getQuestAnswer(), questionDetails.getUserAnswer());
        }


    }

    private void showRightSignWrongSignBoth(String right_ans, String user_answer) {

        switch (right_ans.toLowerCase()) {
            case "a":
                imgA.setImageResource(R.drawable.right_sign);
                imgA.setVisibility(View.VISIBLE);
                break;
            case "b":
                imgB.setImageResource(R.drawable.right_sign);
                imgB.setVisibility(View.VISIBLE);
                break;
            case "c":
                imgC.setImageResource(R.drawable.right_sign);
                imgC.setVisibility(View.VISIBLE);
                break;
            case "d":
                imgD.setImageResource(R.drawable.right_sign);
                imgD.setVisibility(View.VISIBLE);
                break;
            case "e":
                imgE.setImageResource(R.drawable.right_sign);
                imgE.setVisibility(View.VISIBLE);
                break;

            default:
                break;


        }

        switch (user_answer.toLowerCase()) {

            case "a":
                imgA.setImageResource(R.drawable.wrong_sign);
                imgA.setVisibility(View.VISIBLE);
                break;
            case "b":
                imgB.setImageResource(R.drawable.wrong_sign);
                imgB.setVisibility(View.VISIBLE);
                break;
            case "c":
                imgC.setImageResource(R.drawable.wrong_sign);
                imgC.setVisibility(View.VISIBLE);
                break;
            case "d":
                imgD.setImageResource(R.drawable.wrong_sign);
                imgD.setVisibility(View.VISIBLE);
                break;
            case "e":
                imgE.setImageResource(R.drawable.wrong_sign);
                imgE.setVisibility(View.VISIBLE);

            default:
                break;


        }


    }

    private void showRightSignOnly(String user_answer) {

        switch (user_answer.toLowerCase()) {

            case "a":
                imgA.setImageResource(R.drawable.right_sign);
                imgA.setVisibility(View.VISIBLE);
                break;
            case "b":
                imgB.setImageResource(R.drawable.right_sign);
                imgB.setVisibility(View.VISIBLE);
                break;
            case "c":
                imgC.setImageResource(R.drawable.right_sign);
                imgC.setVisibility(View.VISIBLE);
                break;
            case "d":
                imgD.setImageResource(R.drawable.right_sign);
                imgD.setVisibility(View.VISIBLE);
                break;
            case "e":
                imgE.setImageResource(R.drawable.right_sign);
                imgE.setVisibility(View.VISIBLE);

            default:
                break;


        }

    }

    private void setOtherPageNumberColor() {

        for (int i = 0; i < mQuestionsBeanList.size(); i++) {

            if (i == CurrentDisplyQus) {
                continue;
            }

            if (mQuestionsBeanList.get(i).getQuestAnswer().equalsIgnoreCase(mQuestionsBeanList.get(i).getUserAnswer())) {

                questioBar.txtPageNumber[i].setTextColor(Color.WHITE);
                questioBar.txtPageNumber[i].setBackgroundResource(R.drawable.qus_green_round_fill);

            } else {
                questioBar.txtPageNumber[i].setTextColor(Color.WHITE);
                questioBar.txtPageNumber[i].setBackgroundResource(R.drawable.qus_red_round_fill);

            }
        }
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
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("A");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);

        } else if (ans.equalsIgnoreCase("B")) {

            txtOptB.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptB.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("B");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        } else if (ans.equalsIgnoreCase("C")) {

            txtOptC.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptC.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("C");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        } else if (ans.equalsIgnoreCase("D")) {

            txtOptD.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptD.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("D");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        } else if (ans.equalsIgnoreCase("E")) {

            txtOptE.setBackgroundResource(R.drawable.qus_red_round_fill);
            txtOptE.setTextColor(Color.WHITE);
            mQuestionsBeanList.get(CurrentDisplyQus).setAttendAns("E");
            mQuestionsBeanList.get(CurrentDisplyQus).setAttend(true);
        }


    }


    private String removeScript(String content) {
        Pattern p = Pattern.compile("[0-9]+.",
                Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
        return p.matcher(content).replaceAll("");
    }


    private void showDetailsFromLocal(String test_id) {

        mDatabasehelper.openDataBase();

        String response = mDatabasehelper.getTestDetailsAssignment(test_id);

        mDatabasehelper.close();


        try {
            JSONObject mJsonObject = new JSONObject(response);

            if (mJsonObject.getInt(STATUS) == 1) {

                Gson gson = new Gson();
                Type listType = new TypeToken<List<QuestionsBean>>() {
                }.getType();
                mQuestionsBeanList = (List<QuestionsBean>) gson.fromJson(new JSONObject(response).getJSONObject("assignment").getString("questions"), listType);
                scrollViewHistory.setVisibility(View.VISIBLE);

                preFixImagePath = /*new JSONObject(response).getJSONObject("assignment").getString("image_path")*/"https://wagona.com/admin/data/test_quest/";

                QuizHeaderBean mQuizHeaderBean = gson.fromJson(new JSONObject(response).getJSONObject("assignment").getString("header"), QuizHeaderBean.class);

                setHeaderData(mQuizHeaderBean);

                CurrentDisplyQus = 0;
                setQuestionDetails(mQuestionsBeanList.get(0));

            } else {
                showOkDialog(AssignmentMarkTestActivity.this, mJsonObject.getString(MESSAGE));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    /**
     * API call to get all data from server about 10 Questions and options
     * It will run with time and disply
     *
     * @param test_id
     */
    private void callTestDetailsAPI(final String test_id) {


        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");


        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + ASSIGMENTS_HISTORY, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                Log.d("RESPONSE: ", response);
                try {
                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        mDatabasehelper.openDataBase();
                        mDatabasehelper.insertTestDetailsAssignment(test_id, response);
                        mDatabasehelper.close();

                        showDetailsFromLocal(test_id);


                    } else {
                        showOkDialog(AssignmentMarkTestActivity.this, mJsonObject.getString(MESSAGE));
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
                params.put("header_id", test_id);
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));
                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }


    private void showRetryDialog(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                AssignmentMarkTestActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callTestDetailsAPI(AssignmentMarkTestActivity.this.getIntent().getStringExtra("test_id"));

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


}
