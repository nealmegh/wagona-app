package com.wagona.maths;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.google.android.material.tabs.TabLayout;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.dashboard.BRAGFragment;
import com.wagona.maths.dashboard.InstructionsFragment;
import com.wagona.maths.dashboard.SelectTopicsFragment;
import com.wagona.maths.inapp.IabHelper;
import com.wagona.maths.inapp.IabResult;
import com.wagona.maths.inapp.Purchase;
import com.wagona.maths.model.TestDetails;
import com.wagona.maths.model.TopicDetailsBean;
import com.wagona.maths.model.TopicListBean;

import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sotsys-159 on 16/4/16.
 */
public class TopicsActivity extends BaseActivity /*implements IabBroadcastReceiver.IabBroadcastListener */ {


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_topics);
        initControls();
    }

    private ViewPager viewPager;
    private TabLayout tabLayout;
    public TestDetails mTestDetails;

    private void initControls() {
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar_header);
        toolbar.setTitle("");
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        mTestDetails = (TestDetails) this.getIntent().getSerializableExtra("MyObject");
        textHeader.setText(mTestDetails.getDescription());
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();

            }
        });

        //setUpInappThings();

        callTopicListApi();

    }

    void complain(String message) {
        alert("Error: " + message);
    }

    void alert(String message) {
        android.app.AlertDialog.Builder bld = new android.app.AlertDialog.Builder(this);
        bld.setMessage(message);
        bld.setNeutralButton("OK", null);
        bld.create().show();
    }

    //Inapp purchase...
    IabHelper mHelper;

    // Provides purchase notification while this app is running
    //IabBroadcastReceiver mBroadcastReceiver;

    static final String SKU_GAS = "android.test.purchased";
    static final int RC_REQUEST = 10001;

    /*private void setUpInappThings() {

        String base64EncodedPublicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjHKmtfDX/rCaEOCD3ggCAwvRv1sXVkuhdtBq9Ee4mX7Q6fqh1wVZL5N16cyT2Xexq+KHKY2io3IKQSQ6HyEYvq/ifwRZRMavUQh59BjBH8CI6eeRJU6yO3gMextWH/gNO77j+6a0GJxHiQ3jtV1h0ivHRf56zGBLrNqp8GLMEjB1DPXaVlHl2cGTssmsCgz+i8Cfes6YRLroPhV0TozScsEPHLpyPgczNGVB/Pajtjf1QzvuclniKC8SxlcQmo08Snklw7QsAySTFHD1k+MdnuuE02QUCSArqYYt4CAAfR/b0g5YIYANMs6JKxNd9F1EneYbn1q5djMgWHV+jNvDRQIDAQAB";

        mHelper = new IabHelper(this, base64EncodedPublicKey);
        mHelper.enableDebugLogging(true);

        //set up connection with Play service for Inapp
        mHelper.startSetup(new IabHelper.OnIabSetupFinishedListener() {
            public void onIabSetupFinished(IabResult result) {
                if (!result.isSuccess()) {
                    complain("Problem setting up in-app billing: " + result);
                    return;
                }
                if (mHelper == null) return;

                *//*mBroadcastReceiver = new IabBroadcastReceiver(TopicsActivity.this);
                IntentFilter broadcastFilter = new IntentFilter(IabBroadcastReceiver.ACTION);
                registerReceiver(mBroadcastReceiver, broadcastFilter);
                try {
                    mHelper.queryInventoryAsync(mGotInventoryListener);
                } catch (IabHelper.IabAsyncInProgressException e) {
                    complain("Error querying inventory. Another async operation in progress.");
                }*//*
            }
        });
    }*/

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (mHelper == null) return;

        // Pass on the activity result to the helper for handling
        if (!mHelper.handleActivityResult(requestCode, resultCode, data)) {
            // not handled, so handle it ourselves (here's where you'd
            // perform any handling of activity results not related to in-app
            // billing...
            super.onActivityResult(requestCode, resultCode, data);
        }

    }

    /*@Override
    public void receivedBroadcast() {
        try {
            mHelper.queryInventoryAsync(mGotInventoryListener);
        } catch (IabHelper.IabAsyncInProgressException e) {
            complain("Error querying inventory. Another async operation in progress.");
        }

    }*/
    // Listener that's called when we finish querying the items and subscriptions we own
   /* IabHelper.QueryInventoryFinishedListener mGotInventoryListener = new IabHelper.QueryInventoryFinishedListener() {
        public void onQueryInventoryFinished(IabResult result, Inventory inventory) {

            if (mHelper == null) return;
            if (result.isFailure()) {
                complain("Failed to query inventory: " + result);
                return;
            }

            Purchase gasPurchase = inventory.getPurchase(SKU_GAS);
            if (gasPurchase != null) {
                try {
                    mHelper.consumeAsync(inventory.getPurchase(SKU_GAS), mConsumeFinishedListener);

                } catch (IabHelper.IabAsyncInProgressException e) {
                    complain("Error consuming gas. Another async operation in progress.");
                }
                return;
            }

        }
    };*/

    /*  // Called when consumption is complete
      IabHelper.OnConsumeFinishedListener mConsumeFinishedListener = new IabHelper.OnConsumeFinishedListener() {
          public void onConsumeFinished(Purchase purchase, IabResult result) {
              if (mHelper == null) return;
              if (result.isSuccess()) {
                  //update UI

              } else {
                  complain("Error while consuming: " + result);
              }
          }
      };*/
    // Callback for when a purchase is finished
    IabHelper.OnIabPurchaseFinishedListener mPurchaseFinishedListener = new IabHelper.OnIabPurchaseFinishedListener() {
        public void onIabPurchaseFinished(IabResult result, Purchase purchase) {
            // if we were disposed of in the meantime, quit.
            if (mHelper == null) return;

          /*  if (result.isFailure()) {
                complain("Error purchasing: " + result);
                return;
            }*/

            //test purchase here call api

            callPremiumAPI();

            if (purchase.getSku().equals(SKU_GAS)) {
                // purchage done
                Toast.makeText(TopicsActivity.this, "Purchase done", Toast.LENGTH_LONG).show();

            }

        }

    };

    private void callPremiumAPI() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + PREMIUM_FLAG, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                closeProgressDialog();
                try {
                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        callTopicListApi();

                    } else {

                        showOkDialog(TopicsActivity.this, mJsonObject.getString(MESSAGE));

                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }


            }


        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("TAG", "VolleyError:" + error.toString());
                closeProgressDialog();

                if (error.toString().contains("TimeoutError")) {
                    showRetryDialogPremium(error.toString());
                }
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<String, String>();
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));
                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);


    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        // very important:
       /* if (mBroadcastReceiver != null) {
            unregisterReceiver(mBroadcastReceiver);
        }*/

        if (mHelper != null) {
            mHelper.disposeWhenFinished();
            mHelper = null;
        }
    }

    private void initControlsAfterApiCall() {


        viewPager = (ViewPager) findViewById(R.id.viewpager);
        setupViewPager(viewPager);

        tabLayout = (TabLayout) findViewById(R.id.tabs);
        tabLayout.setupWithViewPager(viewPager);


        tabLayout.getTabAt(0).setCustomView(R.layout.tab_textview_topics);
        tabLayout.getTabAt(1).setCustomView(R.layout.tab_textview_topics);
        tabLayout.getTabAt(2).setCustomView(R.layout.tab_textview_topics);

        tabLayout.getTabAt(0).getCustomView().setSelected(true);
        TextView mTextView = (TextView) (tabLayout.getTabAt(0).getCustomView()).findViewById(R.id.textTab);
        mTextView.setTextColor(getResources().getColor(R.color.colorPrimaryDark));
        mTextView.setText("Select Topic(s)");
        mTextView.setTextSize(18);


        ((TextView) (tabLayout.getTabAt(1).getCustomView()).findViewById(R.id.textTab)).setText("Instructions");
        Spannable wordtoSpan = new SpannableString("BRAG Colours");
        wordtoSpan.setSpan(new ForegroundColorSpan(Color.BLACK), 0, 1, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        wordtoSpan.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.arc_red)), 1, 2, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        wordtoSpan.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.arc_orange)), 2, 3, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        wordtoSpan.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.colorPrimaryDark)), 3, 4, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        ((TextView) (tabLayout.getTabAt(2).getCustomView()).findViewById(R.id.textTab)).setText(wordtoSpan);


        tabLayout.setOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {

                Log.e("TAG", "onTabSelected: " + tab.getPosition());

                TextView mTextView = (TextView) (tab.getCustomView()).findViewById(R.id.textTab);
                mTextView.setTextColor(getResources().getColor(R.color.colorPrimaryDark));
                mTextView.setTextSize(18);
                viewPager.setCurrentItem(tab.getPosition());


            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

                Log.e("TAG", "onTabUnselected: " + tab.getPosition());

                TextView mTextView = (TextView) (tab.getCustomView()).findViewById(R.id.textTab);
                mTextView.setTextColor(getResources().getColor(R.color.dark_font));
                mTextView.setTextSize(14);
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });

    }


    private void setupViewPager(ViewPager viewPager) {
        ViewPagerAdapter adapter = new ViewPagerAdapter(getSupportFragmentManager());

        Bundle mBundle = new Bundle();
        mBundle.putString(SUBJECT_ID, mTestDetails.getSubject_id() + "");
        mBundle.putSerializable("ArrayObject", mTopicListBean);
        mBundle.putString("FORM", mTestDetails.getDescription());

        SelectTopicsFragment mSelectTopicsFragment = new SelectTopicsFragment();
        mSelectTopicsFragment.setArguments(mBundle);

        InstructionsFragment mInstructionsFragment = new InstructionsFragment();
        mInstructionsFragment.setArguments(mBundle);

        BRAGFragment mBragFragment = new BRAGFragment();
        mBragFragment.setArguments(mBundle);

        adapter.addFragment(mSelectTopicsFragment, "Select Topic(s)");
        adapter.addFragment(mInstructionsFragment, "Instructions");
        adapter.addFragment(mBragFragment, "BRAG Colours");
        viewPager.setAdapter(adapter);

    }


    class ViewPagerAdapter extends FragmentPagerAdapter {
        private final List<Fragment> mFragmentList = new ArrayList<>();
        private final List<String> mFragmentTitleList = new ArrayList<>();

        public ViewPagerAdapter(FragmentManager manager) {
            super(manager);
        }

        @Override
        public Fragment getItem(int position) {
            return mFragmentList.get(position);
        }

        @Override
        public int getCount() {
            return mFragmentList.size();
        }

        public void addFragment(Fragment fragment, String title) {
            mFragmentList.add(fragment);
            mFragmentTitleList.add(title);
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return mFragmentTitleList.get(position);
        }
    }


    //List<TopicDetailsBean> mTopicDetailsBeans = new ArrayList<>();

    TopicListBean mTopicListBean = new TopicListBean();


    private void callTopicListApi() {


        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_CHECK_LATEST, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                try {
                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        Gson gson = new Gson();
                        Type listType = new TypeToken<List<TopicDetailsBean>>() {
                        }.getType();
                        List<TopicDetailsBean> mTopicDetailsBeans = (List<TopicDetailsBean>) gson.fromJson(new JSONObject(response).getString("topic_details"), listType);

                        mTopicListBean.setmTopicDetailsBeans(mTopicDetailsBeans);

                        initControlsAfterApiCall();

                    } else {

                        closeProgressDialog();

                        AlertDialog.Builder adb = new AlertDialog.Builder(TopicsActivity.this);
                        adb.setTitle(getResources().getString(R.string.app_name));
                        adb.setMessage(mJsonObject.getString(MESSAGE));
                        adb.setPositiveButton("Go Premium", new AlertDialog.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                                String payload = "";
                                try {
                                    mHelper.launchPurchaseFlow(TopicsActivity.this, SKU_GAS, RC_REQUEST,
                                            mPurchaseFinishedListener, payload);
                                } catch (IabHelper.IabAsyncInProgressException e) {
                                    complain("Error launching purchase flow. Another async operation in progress.");
                                }
                            }
                        });
                        adb.setNegativeButton("Cancel", new AlertDialog.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();

                                finish();
                            }
                        });
                        adb.show();
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
                params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));
                params.put(CLASS_ID, managerWagona.getStringDetail(CLASS_ID));
                params.put("subid", mTestDetails.getSubject_id());
                params = SecurityUtils.setSecureParams(params);
                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }

    private void showRetryDialog(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                TopicsActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callTopicListApi();

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


    private void showRetryDialogPremium(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                TopicsActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callTopicListApi();

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
