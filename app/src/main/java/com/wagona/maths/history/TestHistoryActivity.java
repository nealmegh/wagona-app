package com.wagona.maths.history;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.widget.SearchView;

import androidx.appcompat.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.wagona.maths.AppController;
import com.wagona.maths.BaseActivity;
import com.wagona.maths.HomeActivity;
import com.wagona.maths.R;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;
import com.wagona.maths.model.TestHistoryBean;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sotsys-159 on 18/4/16.
 */
public class TestHistoryActivity extends BaseActivity implements SearchView.OnQueryTextListener {


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test_history);

        Toolbar toolbar = (Toolbar) findViewById(R.id.headerStrip);
        toolbar.setTitle("");
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        textHeader.setText("Test History");
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });


        initControls();
    }

    LinearLayoutManager linearLayoutManager = null;
    RecyclerView recycleHistory;
    HistoryRecycleAdapter mHistoryRecycleAdapter = null;

    private ScrollView scrollViewHistory;
    private TextView textTakeTest;

    private void initControls() {

        scrollViewHistory = (ScrollView) findViewById(R.id.scrollViewHistory);
        scrollViewHistory.setVisibility(View.GONE);

        textTakeTest = (TextView) findViewById(R.id.textTakeTest);
        textTakeTest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(TestHistoryActivity.this, HomeActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);


            }
        });

        linearLayoutManager = new LinearLayoutManager(this);
        recycleHistory = (RecyclerView) findViewById(R.id.recycleHistory);
        recycleHistory.setLayoutManager(linearLayoutManager);


        mHistoryRecycleAdapter = new HistoryRecycleAdapter(this);
        recycleHistory.setAdapter(mHistoryRecycleAdapter);

        mHistoryRecycleAdapter.setOnItemClickListner(new HistoryRecycleAdapter.OnItemClickListner() {
            @Override
            public void onItemClickListner(String testID) {
                Intent intent = new Intent(TestHistoryActivity.this, MarkTestActivity.class);
                intent.putExtra("test_id", testID);
                startActivity(intent);
            }

        });

        // setUpSearchView();

        mDatabasehelper.openDataBase();
        String timestamp=mDatabasehelper.getLastTimestamp();
        mDatabasehelper.close();


        callTestHistoryAPI(timestamp);

    }

    List<TestHistoryBean> mTestHistoryBeans = new ArrayList<>();


    private void showOnlyLocalHoistory() {

        Gson gson = new GsonBuilder().create();

        mDatabasehelper.openDataBase();

        Cursor mCursor = mDatabasehelper.getAllHistoryData(managerWagona.getStringDetail(STUDENT_ID));

        if (mCursor != null) {
            if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
                do {
                    TestHistoryBean mTestHistoryBean = gson.fromJson(mCursor.getString(mCursor.getColumnIndex(JSON_DATA)), TestHistoryBean.class);
                    mTestHistoryBeans.add(mTestHistoryBean);

                } while (mCursor.moveToNext());
            }
        }
        mCursor.close();
        mDatabasehelper.close();

        if (mTestHistoryBeans.size() != 0) {
            scrollViewHistory.setVisibility(View.VISIBLE);
            mHistoryRecycleAdapter.setArrayListData(mTestHistoryBeans);
        } else {
            scrollViewHistory.setVisibility(View.GONE);
            showOkDialog(TestHistoryActivity.this, "No History available");
        }


    }


    private void callTestHistoryAPI(final String timestamp) {

        if (!isNetworkAvailable(this)) {

            showOnlyLocalHoistory();

            return;
        }
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_MYTEST, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                try {
                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt("status") == 1) {

                        JSONArray mJsonArray = mJsonObject.getJSONArray("test_details");


                        mDatabasehelper.openDataBase();

                        for (int i = 0; i < mJsonArray.length(); i++) {

                            JSONObject mTestObject = mJsonArray.getJSONObject(i);
                            mDatabasehelper.inserHistoryData(managerWagona.getStringDetail(STUDENT_ID),mTestObject.getString("test_id"), mTestObject.toString());
                            // Gson gson = new GsonBuilder().create();
                            // TestHistoryBean mTestHistoryBean = gson.fromJson(mTestObject.toString(), TestHistoryBean.class);
                            // mTestHistoryBeans.add(mTestHistoryBean);
                        }

                        mDatabasehelper.setTimeStamp();

                        mDatabasehelper.close();



                        /*Gson gson = new Gson();
                        Type listType = new TypeToken<List<TestHistoryBean>>(){}.getType();
                        mTestHistoryBeans = (List<TestHistoryBean>) gson.fromJson(new JSONObject(response).getString("test_details"), listType);*/

                       /* if(mTestHistoryBeans.size()!=0){
                            scrollViewHistory.setVisibility(View.VISIBLE);
                            mHistoryRecycleAdapter.setArrayListData(mTestHistoryBeans);
                        }else {
                            scrollViewHistory.setVisibility(View.GONE);
                            showOkDialog(TestHistoryActivity.this,mJsonObject.getString(MESSAGE));
                        }*/


                    } else {
                        // showOkDialog(TestHistoryActivity.this,mJsonObject.getString(MESSAGE));
                    }

                    showOnlyLocalHoistory();

                } catch (Exception e) {
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
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));

                if(!timestamp.equalsIgnoreCase("0")){
                    params.put("unixtimestamp", timestamp);
                }
                // params.put(USER_ID,"677");
                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.search_menu, menu);

        // Associate searchable configuration with the SearchView
        SearchManager searchManager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);
        SearchView searchView = (SearchView) menu.findItem(R.id.search).getActionView();
        searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));

        searchView.setMaxWidth(Integer.MAX_VALUE);

        searchView.setOnQueryTextListener(this);

        return true;
    }

    @Override
    public boolean onQueryTextChange(String query) {
        // Here is where we are going to implement our filter logic
        final List<TestHistoryBean> filteredModelList = filter(mTestHistoryBeans, query);
        // mHistoryRecycleAdapter.setArrayListData(filteredModelList);
        // mHistoryRecycleAdapter.animateTo(filteredModelList);

        mHistoryRecycleAdapter.setFilter(filteredModelList);

        //recycleHistory.scrollToPosition(0);

        return true;
    }

    private List<TestHistoryBean> filter(List<TestHistoryBean> models, String query) {
        query = query.toLowerCase();

        final List<TestHistoryBean> filteredModelList = new ArrayList<>();
        for (TestHistoryBean model : models) {
            if ((model.getSubject_description().toLowerCase()).contains(query)) {
                filteredModelList.add(model);
            } else if ((model.getDate_updated().toLowerCase()).contains(query)) {
                filteredModelList.add(model);
            } else if ((model.getNum_topics() + "").contains(query)) {
                filteredModelList.add(model);
            } else if ((model.getNum_questions() + "").contains(query)) {
                filteredModelList.add(model);
            } else if ((model.getNum_correct() + "").contains(query)) {
                filteredModelList.add(model);
            } else if ((model.getScore_percent() + "").contains(query)) {
                filteredModelList.add(model);
            }

        }
        return filteredModelList;
    }


    @Override
    public boolean onQueryTextSubmit(String query) {
        return false;
    }


}
