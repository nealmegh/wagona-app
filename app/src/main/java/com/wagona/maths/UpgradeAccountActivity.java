package com.wagona.maths;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.shashank.sony.fancygifdialoglib.FancyGifDialog;
import com.shashank.sony.fancygifdialoglib.FancyGifDialogListener;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.Utils.SpaceItemDecoration;
import com.wagona.maths.model.PaymentTypeBean;

import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UpgradeAccountActivity extends BaseActivity {

    String PAYMENT_TYPE;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_upgrade_account);


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
        textHeader.setText("Upgrade Account");

        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }


    private RecyclerView recyclePayment;
    private PaymentTypeAdapter mPaymentTypeAdapter;

    private void initControls() {

        recyclePayment = (RecyclerView) findViewById(R.id.recyclePayment);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        recyclePayment.setLayoutManager(linearLayoutManager);

        recyclePayment.addItemDecoration(new SpaceItemDecoration(dpToPx(this, 15)));


        mPaymentTypeAdapter = new PaymentTypeAdapter(this);
        recyclePayment.setAdapter(mPaymentTypeAdapter);

        mPaymentTypeAdapter.setListItemClick(new PaymentTypeAdapter.ListActions() {
            @SuppressLint("ResourceType")
            @Override
            public void onItemClick(final PaymentTypeBean mitem, int position, View view) {

                //callPayPal(item);
//                callApiToGetSubscriptionUrl(item);
/*

                //Creating the instance of PopupMenu
                PopupMenu popup = new PopupMenu(UpgradeAccountActivity.this, view);
                //Inflating the Popup using xml file
                popup.getMenuInflater().inflate(R.menu.poupup_menu, popup.getMenu());

                //registering popup with OnMenuItemClickListener
                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    public boolean onMenuItemClick(MenuItem item) {

                        if (item.getTitle().equals("PayPal")){
                            PAYMENT_CHECK = PAYMENT_CHECK_URL;
                            LINK = "paypal_link";
                            PAYMENT_TYPE = "paypal";
                            callApiToGetSubscriptionUrl(mitem);
//                            Toast.makeText(UpgradeAccountActivity.this,"You Clicked : " + item.getTitle(),Toast.LENGTH_SHORT).show();
                        } else {
                            PAYMENT_CHECK = PAYMENT_CHECK_URL_PAYNOW;
                            LINK = "paynow_link";
                            PAYMENT_TYPE = "paynow";
                            callApiToGetSubscriptionUrl(mitem);
                        }

                        return true;
                    }
                });

                popup.show();//showing popup menu
*/

                new FancyGifDialog.Builder(UpgradeAccountActivity.this)
                        .setTitle("Select Payment Option")
                        .setMessage("Proceed to checkout, and you can enjoy all featuress.")
                        .setNegativeBtnText("PayPal")
                        .setPositiveBtnBackground(Color.parseColor("#0072BC"))
                        .setPositiveBtnText("PayNow")
                        .setNegativeBtnBackground(Color.parseColor("#253B80"))
                        .setGifResource(R.drawable.examgif)   //Pass your Gif here
                        .isCancellable(true)
                        .OnPositiveClicked(new FancyGifDialogListener() {
                            @Override
                            public void OnClick() {
                                PAYMENT_TYPE = "paynow";
                                callApiToGetSubscriptionUrl(mitem);
                            }
                        })
                        .OnNegativeClicked(new FancyGifDialogListener() {
                            @Override
                            public void OnClick() {
                                PAYMENT_TYPE = "paypal";
                                callApiToGetSubscriptionUrl(mitem);
                            }
                        })
                        .build();

            }
        });

        callPaymentType();

    }

   /* public void popup (View v) {
        //Creating the instance of PopupMenu
        PopupMenu popup = new PopupMenu(UpgradeAccountActivity.this, v);
        //Inflating the Popup using xml file
        popup.getMenuInflater().inflate(R.menu.poupup_menu, popup.getMenu());

        //registering popup with OnMenuItemClickListener
        popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
            public boolean onMenuItemClick(MenuItem item) {
                Toast.makeText(UpgradeAccountActivity.this,"You Clicked : " + item.getTitle(),Toast.LENGTH_SHORT).show();
                return true;
            }
        });

        popup.show();//showing popup menu
    }
*/
    public static int dpToPx(Context context, int dp) {
        int px = Math.round(dp * getPixelScaleFactor(context));
        return px;
    }

    private static float getPixelScaleFactor(Context context) {
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        return (displayMetrics.xdpi / DisplayMetrics.DENSITY_DEFAULT);
    }

    private void callPaymentType() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.GET, getBaseUrl() + GET_PAYMENT_TYPES, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                closeProgressDialog();
                try {
                    JSONObject mJsonObject = new JSONObject(response);
                    if (mJsonObject.getInt(STATUS) == 1) {

                        Gson gson = new Gson();
                        Type listType = new TypeToken<List<PaymentTypeBean>>() {
                        }.getType();
                        List<PaymentTypeBean> mPaymentTypeBeanList = (List<PaymentTypeBean>) gson.fromJson(new JSONObject(response).getString("payment_types"), listType);
                        mPaymentTypeAdapter.setItemList(mPaymentTypeBeanList);
                        mPaymentTypeAdapter.notifyDataSetChanged();

                    } else {

                        showOkDialog(UpgradeAccountActivity.this, mJsonObject.getString(MESSAGE));

                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }


            }


        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                closeProgressDialog();

               /* if (error.toString().contains("TimeoutError")) {
                    showRetryDialogPremium(error.toString());
                }*/
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


    private void showRetryDialog(String error) {
        androidx.appcompat.app.AlertDialog.Builder alertDialogBuilder = new androidx.appcompat.app.AlertDialog.Builder(
                UpgradeAccountActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        //  callContactUsApi();
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        finish();
                    }
                });

        // create alert dialog
        androidx.appcompat.app.AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();
    }



    /**
     * Api for get subcription url and load it with new screen
     */
    private void callApiToGetSubscriptionUrl(final PaymentTypeBean item) {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, PAYMENT_CHECK_URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //{"school_id":6,"success":"1","message":"You enquiry for school registration is sent successfully. your number is 6"}

                try {

                    Log.d("RESPONSE", response);
                    JSONObject mJsonObject = new JSONObject(response);


                    if (mJsonObject.getInt("response_code") == 200) {

                        Intent mIntent = new Intent(UpgradeAccountActivity.this, PaySubscriptionActivity.class);
                        mIntent.putExtra("URL", mJsonObject.getString("link"));
                        startActivity(mIntent);

                    }

                    /*if (mJsonObject.getInt(STATUS) == 1) {

                        AlertDialog.Builder adb = new AlertDialog.Builder(UpgradeAccountActivity.this);
                        adb.setTitle(getResources().getString(R.string.app_name));
                        adb.setMessage(mJsonObject.getString(MESSAGE));
                        adb.setPositiveButton("Ok", new AlertDialog.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();

                                loggedOut();
                            }
                        });
                        adb.show();

                    } else {

                        showOkDialog(UpgradeAccountActivity.this, mJsonObject.getString(MESSAGE));
                    }*/

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

                Log.d("PAYMENT: ", item.getType_id() + "  "+managerWagona.getStringDetail(ACCOUNT_ID));
                Map<String, String> params = new HashMap<String, String>();
                params.put("payment_type_id", item.getType_id());
                params.put("payment_method", PAYMENT_TYPE);
                params.put("account_id", managerWagona.getStringDetail(ACCOUNT_ID));
                // params = SecurityUtils.setSecureParams(params);


                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);


    }


    // logged out & recirect to login screen again


}
