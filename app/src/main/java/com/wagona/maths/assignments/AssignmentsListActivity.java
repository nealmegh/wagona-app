package com.wagona.maths.assignments;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.google.gson.Gson;
import com.wagona.maths.AppController;
import com.wagona.maths.BaseActivity;
import com.wagona.maths.R;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;
import com.wagona.maths.adapter.AssignmentsListAdapter;
import com.wagona.maths.assignments.historyAssignment.AssignmentMarkTestActivity;
import com.wagona.maths.offsetResponse.AssignmentsResponse;
import com.wagona.maths.offsetResponse.ListActions;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AssignmentsListActivity extends BaseActivity {

    RecyclerView rcv_assignments;
    LinearLayout ll_null_data;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_assigments_list);
        setScreenToolbar();
        rcv_assignments = (RecyclerView) findViewById(R.id.rcv_assignments);
        ll_null_data = (LinearLayout) findViewById(R.id.ll_null_data);

        GridLayoutManager manager = new GridLayoutManager(this, 1);
        rcv_assignments.setHasFixedSize(true);
        rcv_assignments.setLayoutManager(manager);
        rcv_assignments.setItemAnimator(new DefaultItemAnimator());

        callAssignmentsApi();
    }

    private Toolbar toolbar;

    private void setScreenToolbar() {
        toolbar = (Toolbar) findViewById(R.id.headerLayoutALA);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeaderALA);
        textHeader.setText(getString(R.string.assignments));


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

    private void callAssignmentsApi() {

        if (!isNetworkAvailable(this)) {

            goOfflineDashBoard();

            return;

        }
        showProgressDialog("Loading...");
        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_ASSIGMENTS, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                parsResponseAssignments(response);
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
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));
                params.put(CLASS_ID, managerWagona.getStringDetail(CLASS_ID));

                params.put(SCHOOL_NAME, "Nyahondo High School");
                params.put("school_user", "student");
                params.put("school_account", "1");
                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }

    List<AssignmentsResponse> assignmentsList = new ArrayList<>();

    private void parsResponseAssignments(String response) {
        assignmentsList.clear();
        try {
            Log.e("TEST>>", response);
            JSONObject jsonObject = new JSONObject(response);
            JSONArray mJsonArray = jsonObject.getJSONArray("assignments");
            if (mJsonArray != null && mJsonArray.length() > 0) {
//                mDatabasehelper.openDataBase();
//                mDatabasehelper.insertAssignment(response);
//                mDatabasehelper.close();
                for (int i = 0; i < mJsonArray.length(); i++) {
                    assignmentsList.add(new Gson().fromJson(mJsonArray.getJSONObject(i).toString(), AssignmentsResponse.class));
                }
                manageData();

            } else {
                showOkDialog(this, "No data for Assignments");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void manageData() {
        if (assignmentsList == null || assignmentsList.size() == 0) {
            hideListView();
        } else {
            showListView();
            setAdapter();
        }
    }

    private void showListView() {
        ll_null_data.setVisibility(View.GONE);
    }

    private void hideListView() {
        ll_null_data.setVisibility(View.VISIBLE);
    }

    AssignmentsListAdapter adapter;

    private void setAdapter() {
        adapter = new AssignmentsListAdapter(this, assignmentsList, new ListActions() {
            @Override
            public void onItemClick(Object o, int position) {
                if (null == assignmentsList.get(position).getScore_percent()) {
//                    callTakeAssigmentApi(assignmentsList.get(position).getId());

                    Log.d("HEADER_ID: ", assignmentsList.get(position).getId());
                    Intent i = new Intent(getApplicationContext(), AssignmentplayActivity.class);
                    i.putExtra("HEARDER_ID", assignmentsList.get(position).getId());
                    i.putExtra("TITLE", assignmentsList.get(position).getName());
                    i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    startActivity(i);

                } else {
//                    callAssigmentHistoryApi(assignmentsList.get(position).getId());
                    Log.d("TEST_ID: ", assignmentsList.get(position).getId());
                    Log.d("STUDENT_ID: ", managerWagona.getStringDetail(STUDENT_ID));
                    Intent intent = new Intent(AssignmentsListActivity.this, AssignmentMarkTestActivity.class);
                    intent.putExtra("test_id", assignmentsList.get(position).getId());
                    intent.putExtra("TITLE", assignmentsList.get(position).getName());
                    startActivity(intent);
                }
            }
        });
        rcv_assignments.setAdapter(adapter);
    }


    private void goOfflineDashBoard() {

//        mDatabasehelper.openDataBase();
//        String response = mDatabasehelper.getAssignments();
//        mDatabasehelper.close();
//
//        if (!response.equalsIgnoreCase("0")) {
//            parsResponseAssignments(response);
//        } else {
//            showOkDialog(this, "No data for Assignments. Please go online and get your Assignment data");
//        }
        showOfflineRetryDialog("No data for Assignments. Please go online and get your Assignment data");


    }

    private void showRetryDialog(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                AssignmentsListActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callAssignmentsApi();

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

    private void showOfflineRetryDialog(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                AssignmentsListActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage(error)
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callAssignmentsApi();

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

    /*Api call for get assignment history
    * @Param timestamp,token,header_id,user_id,nonce
    * type post
    * https://wagona.com/webservices/assignment_history
    */
    private void callAssigmentHistoryApi(final String header_id) {
        if (!isNetworkAvailable(this)) {

            goOfflineDashBoard();

            return;

        }
        showProgressDialog("Loading...");
        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + ASSIGMENTS_HISTORY, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                parsResponseHistory(response);
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
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));

                params.put(HEADER_ID, header_id);

                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }


    private void parsResponseHistory(String response) {
        try {
            JSONObject mJsonObject = new JSONObject(response);

            if (mJsonObject.getBoolean("valid")) {
                Toast.makeText(this, response, Toast.LENGTH_SHORT).show();
            }
            Log.e("Tag", response);
        } catch (Exception e) {
            e.printStackTrace();
        }


    }


    /*Api call for take assignment
  * @Param timestamp,token,header_id,user_id,nonce
  * type post
  * https://wagona.com/webservices/assignment_take
  */
    private void callTakeAssigmentApi(final String header_id) {
        if (!isNetworkAvailable(this)) {

            goOfflineDashBoard();

            return;

        }
        showProgressDialog("Loading...");
        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + TAKE_ASSIGMENTS, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                parsResponseHistory(response);

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
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));

                params.put(HEADER_ID, header_id);

                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }

}
