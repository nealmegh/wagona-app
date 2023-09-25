package com.wagona.maths.dashboard;

/**
 * Created by sotsys-159 on 14/4/16.
 */


import android.content.Intent;
import android.graphics.PorterDuff;
import android.os.Bundle;
//import android.support.annotation.Nullable;
//import android.support.v4.content.ContextCompat;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.wagona.maths.AppController;
import com.wagona.maths.R;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;
import com.wagona.maths.assignments.AssignmentsListActivity;
import com.wagona.maths.history.MarkTestActivity;
import com.wagona.maths.history.TestHistoryActivity;
import com.wagona.maths.TopicsActivity;
import com.wagona.maths.custom.ArcProgress;
import com.wagona.maths.model.TestDetails;
import com.wagona.maths.model.TestHistoryBean;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class Form1Fragment extends BaseFragment {

    public Form1Fragment() {
        // Required empty public constructor
    }

    private TestDetails mTestDetails = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mTestDetails = (TestDetails) getArguments().getSerializable("MyObject");


    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_form_old, container, false);
    }


    private TextView txtTestName1;
    private TextView txtTestDate1;
    private TextView textPercent1;

    private TextView txtTestName2;
    private TextView txtTestDate2;
    private TextView textPercent2;

    private TextView txtTestName3;
    private TextView txtTestDate3;
    private TextView textPercent3;

    private TextView txtTestName4;
    private TextView txtTestDate4;
    private TextView textPercent4;

    private TextView txtTestName5;
    private TextView txtTestDate5;
    private TextView textPercent5;

    private TextView txtGrade;
    private TextView textPercent;

    private ArcProgress arc_progress;
    private ArcProgress arc_progress1;
    private ArcProgress arc_progress2;
    private ArcProgress arc_progress3;
    private ArcProgress arc_progress4;
    private ArcProgress arc_progress5;

    private RelativeLayout layoutTest1;
    private RelativeLayout layoutTest2;
    private RelativeLayout layoutTest3;
    private RelativeLayout layoutTest4;
    private RelativeLayout layoutTest5;

    private TextView tvNoOfAssignment;

    private static String NO_OF_ASS = "";


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);


        TextView textTakeTest = (TextView) view.findViewById(R.id.textTakeTest);
        textTakeTest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), TopicsActivity.class);
                intent.putExtra("MyObject", mTestDetails);
                startActivity(intent);
            }
        });


        TextView txtTestHistory = (TextView) view.findViewById(R.id.txtTestHistory);
        txtTestHistory.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), TestHistoryActivity.class);
                startActivity(intent);
            }
        });



        TextView txtAssignment = (TextView) view.findViewById(R.id.txtAssignment);
        txtAssignment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), AssignmentsListActivity.class);
                startActivity(intent);
            }
        });


        txtTestName1 = (TextView) view.findViewById(R.id.txtTestName1);
        txtTestDate1 = (TextView) view.findViewById(R.id.txtTestDate1);
        textPercent1 = (TextView) view.findViewById(R.id.textPercent1);

        txtTestName2 = (TextView) view.findViewById(R.id.txtTestName2);
        txtTestDate2 = (TextView) view.findViewById(R.id.txtTestDate2);
        textPercent2 = (TextView) view.findViewById(R.id.textPercent2);

        txtTestName3 = (TextView) view.findViewById(R.id.txtTestName3);
        txtTestDate3 = (TextView) view.findViewById(R.id.txtTestDate3);
        textPercent3 = (TextView) view.findViewById(R.id.textPercent3);

        txtTestName4 = (TextView) view.findViewById(R.id.txtTestName4);
        txtTestDate4 = (TextView) view.findViewById(R.id.txtTestDate4);
        textPercent4 = (TextView) view.findViewById(R.id.textPercent4);

        txtTestName5 = (TextView) view.findViewById(R.id.txtTestName5);
        txtTestDate5 = (TextView) view.findViewById(R.id.txtTestDate5);
        textPercent5 = (TextView) view.findViewById(R.id.textPercent5);

        txtGrade = (TextView) view.findViewById(R.id.txtGrade);
        textPercent = (TextView) view.findViewById(R.id.textPercent);

        arc_progress = (ArcProgress) view.findViewById(R.id.arc_progress);
        arc_progress1 = (ArcProgress) view.findViewById(R.id.arc_progress1);
        arc_progress2 = (ArcProgress) view.findViewById(R.id.arc_progress2);
        arc_progress3 = (ArcProgress) view.findViewById(R.id.arc_progress3);
        arc_progress4 = (ArcProgress) view.findViewById(R.id.arc_progress4);
        arc_progress5 = (ArcProgress) view.findViewById(R.id.arc_progress5);


        layoutTest1 = (RelativeLayout) view.findViewById(R.id.layoutTest1);
        layoutTest2 = (RelativeLayout) view.findViewById(R.id.layoutTest2);
        layoutTest3 = (RelativeLayout) view.findViewById(R.id.layoutTest3);
        layoutTest4 = (RelativeLayout) view.findViewById(R.id.layoutTest4);
        layoutTest5 = (RelativeLayout) view.findViewById(R.id.layoutTest5);

        tvNoOfAssignment = (TextView) view.findViewById(R.id.tvNoOfAssignments);

        callAssignmentCount();


        layoutTest1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                if (mTestDetails.getTests().get(0).getTest_id() != null) {

                    Intent intent = new Intent(getActivity(), MarkTestActivity.class);
                    intent.putExtra("test_id", mTestDetails.getTests().get(0).getTest_id());
                    startActivity(intent);

                }

            }
        });

        layoutTest2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                if (mTestDetails.getTests().get(1).getTest_id() != null) {

                    Intent intent = new Intent(getActivity(), MarkTestActivity.class);
                    intent.putExtra("test_id", mTestDetails.getTests().get(1).getTest_id());
                    startActivity(intent);

                }

            }
        });


        layoutTest3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                if (mTestDetails.getTests().get(2).getTest_id() != null) {

                    Intent intent = new Intent(getActivity(), MarkTestActivity.class);
                    intent.putExtra("test_id", mTestDetails.getTests().get(2).getTest_id());
                    startActivity(intent);

                }


            }
        });

        layoutTest4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (mTestDetails.getTests().get(3).getTest_id() != null) {

                    Intent intent = new Intent(getActivity(), MarkTestActivity.class);
                    intent.putExtra("test_id", mTestDetails.getTests().get(3).getTest_id());
                    startActivity(intent);

                }
            }
        });

        layoutTest5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if (mTestDetails.getTests().get(4).getTest_id() != null) {

                    Intent intent = new Intent(getActivity(), MarkTestActivity.class);
                    intent.putExtra("test_id", mTestDetails.getTests().get(4).getTest_id());
                    startActivity(intent);

                }

            }
        });


        setDataToControls();




    }

    private void setDataToControls() {

        txtGrade.setText(mTestDetails.getGrade());
        textPercent.setText(getLableText(mTestDetails.getAverage()));
        arc_progress.setProgress(getProgressData(mTestDetails.getAverage()));

        arc_progress.setFinishedStrokeColor(getApropriateColor(mTestDetails.getAverage()));
        textPercent.setTextColor(getApropriateColor(mTestDetails.getAverage()));


        //test 1
        txtTestName1.setText(mTestDetails.getTests().get(0).getTest());
        txtTestDate1.setText(mTestDetails.getTests().get(0).getDate());
        textPercent1.setText(getLableText(mTestDetails.getTests().get(0).getScore()));
        arc_progress1.setProgress(getProgressData(mTestDetails.getTests().get(0).getScore()));


        //test 2
        txtTestName2.setText(mTestDetails.getTests().get(1).getTest());
        txtTestDate2.setText(mTestDetails.getTests().get(1).getDate());
        textPercent2.setText(getLableText(mTestDetails.getTests().get(1).getScore()));
        arc_progress2.setProgress(getProgressData(mTestDetails.getTests().get(1).getScore()));


        //test 3
        txtTestName3.setText(mTestDetails.getTests().get(2).getTest());
        txtTestDate3.setText(mTestDetails.getTests().get(2).getDate());
        textPercent3.setText(getLableText(mTestDetails.getTests().get(2).getScore()));
        arc_progress3.setProgress(getProgressData(mTestDetails.getTests().get(2).getScore()));


        //test 4
        txtTestName4.setText(mTestDetails.getTests().get(3).getTest());
        txtTestDate4.setText(mTestDetails.getTests().get(3).getDate());
        textPercent4.setText(mTestDetails.getTests().get(3).getScore());
        arc_progress4.setProgress(getProgressData(mTestDetails.getTests().get(3).getScore()));

        //test 5
        txtTestName5.setText(mTestDetails.getTests().get(4).getTest());
        txtTestDate5.setText(mTestDetails.getTests().get(4).getDate());
        textPercent5.setText(getLableText(mTestDetails.getTests().get(4).getScore()));
        arc_progress5.setProgress(getProgressData(mTestDetails.getTests().get(4).getScore()));


        /**
         * Set color to controls
         * */

        //test 1 colors
        txtTestDate1.setTextColor(getDateColor(mTestDetails.getTests().get(0).getScore()));
        arc_progress1.setFinishedStrokeColor(getApropriateColor(mTestDetails.getTests().get(0).getScore()));
        textPercent1.setTextColor(getApropriateColor(mTestDetails.getTests().get(0).getScore()));
        txtTestName1.setTextColor(getTestNameColor(mTestDetails.getTests().get(0).getDate()));

        //test 1 colors
        txtTestDate2.setTextColor(getDateColor(mTestDetails.getTests().get(1).getScore()));
        arc_progress2.setFinishedStrokeColor(getApropriateColor(mTestDetails.getTests().get(1).getScore()));
        textPercent2.setTextColor(getApropriateColor(mTestDetails.getTests().get(1).getScore()));
        txtTestName2.setTextColor(getTestNameColor(mTestDetails.getTests().get(1).getDate()));

        //test 1 colors
        txtTestDate3.setTextColor(getDateColor(mTestDetails.getTests().get(2).getScore()));
        arc_progress3.setFinishedStrokeColor(getApropriateColor(mTestDetails.getTests().get(2).getScore()));
        textPercent3.setTextColor(getApropriateColor(mTestDetails.getTests().get(2).getScore()));
        txtTestName3.setTextColor(getTestNameColor(mTestDetails.getTests().get(2).getDate()));

        //test 1 colors
        txtTestDate4.setTextColor(getDateColor(mTestDetails.getTests().get(3).getScore()));
        arc_progress4.setFinishedStrokeColor(getApropriateColor(mTestDetails.getTests().get(3).getScore()));
        textPercent4.setTextColor(getApropriateColor(mTestDetails.getTests().get(3).getScore()));
        txtTestName4.setTextColor(getTestNameColor(mTestDetails.getTests().get(3).getDate()));

        //test 1 colors
        txtTestDate5.setTextColor(getDateColor(mTestDetails.getTests().get(4).getScore()));
        arc_progress5.setFinishedStrokeColor(getApropriateColor(mTestDetails.getTests().get(4).getScore()));
        textPercent5.setTextColor(getApropriateColor(mTestDetails.getTests().get(4).getScore()));
        txtTestName5.setTextColor(getTestNameColor(mTestDetails.getTests().get(4).getDate()));


    }

    private String getLableText(String score) {

        if (score.equalsIgnoreCase("--")) {
            return score;
        }
        return score + "%";
    }

    private int getTestNameColor(String date) {

        if (date.equalsIgnoreCase("Pending")) {
            return ContextCompat.getColor(getActivity(), R.color.arc_red);
        } else {
            return ContextCompat.getColor(getActivity(), R.color.colorPrimaryDark);
        }


    }


    //
    private int getProgressData(String score) {
        if (score.equalsIgnoreCase("--")) {
            return 0;
        }
        return Integer.parseInt(score);
    }

    //get finishArc and percent lable color
    public int getApropriateColor(String score) {

        if (score.equalsIgnoreCase("--")) {
            return ContextCompat.getColor(getActivity(), R.color.dark_font);

        } else {
            if (Integer.parseInt(score) > 0 && Integer.parseInt(score) < 50) {

                return ContextCompat.getColor(getActivity(), R.color.arc_red);

            } else if (Integer.parseInt(score) >= 50 && Integer.parseInt(score) < 75) {

                return ContextCompat.getColor(getActivity(), R.color.arc_orange);

            } else if (Integer.parseInt(score) >= 75) {
                //green
                return ContextCompat.getColor(getActivity(), R.color.colorPrimaryDark);
            }

        }
        return ContextCompat.getColor(getActivity(), R.color.dark_font);
    }

    //get date color function
    public int getDateColor(String score) {

        if (score.equalsIgnoreCase("--")) {
            return ContextCompat.getColor(getActivity(), R.color.arc_red);
        }
        return ContextCompat.getColor(getActivity(), R.color.dark_font);
    }






    private void callAssignmentCount() {

        if (!isNetworkAvailable(getActivity())) {
            if (NO_OF_ASS.trim().equals("") || NO_OF_ASS.equals("0")) {
                tvNoOfAssignment.getBackground().setColorFilter(getResources().getColor(R.color.hint_color),
                        PorterDuff.Mode.SRC_ATOP);
                tvNoOfAssignment.setVisibility(View.VISIBLE);
                tvNoOfAssignment.setText("0");
            } else {
                tvNoOfAssignment.getBackground().setColorFilter(getResources().getColor(R.color.arc_red),
                        PorterDuff.Mode.SRC_ATOP);
                tvNoOfAssignment.setVisibility(View.VISIBLE);
                tvNoOfAssignment.setText(NO_OF_ASS);
            }

            return;

        }
        showProgressDialog("Authorising...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + ASSIGNMWNT_COUNT, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                try {
                    JSONObject jsonObject = new JSONObject(response);
                    if (jsonObject.getInt(STATUS) == 1) {
                        tvNoOfAssignment.setVisibility(View.VISIBLE);
                        NO_OF_ASS = jsonObject.getString("count");
                        if (NO_OF_ASS.equals("") || NO_OF_ASS.equals("0")) {
                            tvNoOfAssignment.getBackground().setColorFilter(getResources().getColor(R.color.hint_color),
                                    PorterDuff.Mode.SRC_ATOP);
                            tvNoOfAssignment.setVisibility(View.VISIBLE);
                            tvNoOfAssignment.setText("0");
                        } else {
                            tvNoOfAssignment.getBackground().setColorFilter(getResources().getColor(R.color.arc_red),
                                    PorterDuff.Mode.SRC_ATOP);
                            tvNoOfAssignment.setVisibility(View.VISIBLE);
                            tvNoOfAssignment.setText(NO_OF_ASS);
                        }

                    } else {
//                        showOkDialog(getActivity(), mJsonObject.getString(MESSAGE));
                        tvNoOfAssignment.setVisibility(View.GONE);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                closeProgressDialog();

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
                closeProgressDialog();
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {

                Map<String, String> params = new HashMap<String, String>();
                params.put("student_id", managerWagona.getStringDetail(STUDENT_ID));

                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(getActivity()).addToRequestQueue(mStringRequest);
    }



}