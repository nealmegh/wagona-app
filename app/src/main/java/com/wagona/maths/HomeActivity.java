package com.wagona.maths;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.viewpager.widget.ViewPager;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.bumptech.glide.Glide;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.tabs.TabLayout;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wagona.maths.Utils.CircleTransform;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.dashboard.Form1Fragment;
import com.wagona.maths.login.SignInActivity;
import com.wagona.maths.model.TestDetails;
import com.wagona.maths.profileinfo.AboutUsActivity;
import com.wagona.maths.profileinfo.ContactUsActivity;
import com.wagona.maths.profileinfo.EditProfileActivity;
import com.wagona.maths.profileinfo.HowItWorksActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class HomeActivity extends BaseActivity {


    public static String dialogMessage;
    private DrawerLayout drawer;

    private NavigationView navigationView = null;

    private ViewPager viewPager;
    private TabLayout tabLayout;

    private ImageView imgUpgrade;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar_header);
        toolbar.setTitle("");
        setSupportActionBar(toolbar);

        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        imgUpgrade = (ImageView) toolbar.findViewById(R.id.imgUpgrade);

        // setPaymentButton();

        textHeader.setText("Wagona Maths");


        drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        navigationView = (NavigationView) findViewById(R.id.nav_view);

        viewPager = (ViewPager) findViewById(R.id.viewpager);


        tabLayout = (TabLayout) findViewById(R.id.tabs);


        initNavigationDrawer();

        LocalBroadcastManager.getInstance(this).registerReceiver(mUpdateProfilePic,
                new IntentFilter("UpdateProfile"));


    }

/*    private void setPaymentButton() {
        if (managerWagona.getStringDetail(PAYMENT_STATUS).equalsIgnoreCase("NOT-COMPLETE")) {

            imgUpgrade.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    showUpgradeDialog();
                }
            });

        } else {
            imgUpgrade.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    showCancelSubcriptionDialog();
                }
            });

        }
    }*/

    private void showCancelSubcriptionDialog(String dialogMessageText) {


        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(HomeActivity.this);
        // set title
        alertDialogBuilder.setTitle("Unsubscribe");
        // set dialog message
        alertDialogBuilder
                .setMessage(dialogMessageText + "\n\n" + getResources().getString(R.string.msg_expire_acc_remove))
                .setCancelable(false)
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {

                        //call api
                        callApiToCancelSubscribtion();


                    }
                })
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {

                        dialog.cancel();
                    }
                });
        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();
        // show it
        alertDialog.show();

    }

    private void showUpgradeDialog(String dialogMessage) {


        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(HomeActivity.this);
        // set title
        alertDialogBuilder.setTitle("Upgrade Account");
        // set dialog message
        alertDialogBuilder
                .setMessage(dialogMessage)
                .setCancelable(false)
                .setPositiveButton("Upgrade", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {

                        Intent intent = new Intent(HomeActivity.this, UpgradeAccountActivity.class);
                        startActivity(intent);

                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {

                        dialog.cancel();
                    }
                });
        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();
        // show it
        alertDialog.show();

    }

    private BroadcastReceiver mUpdateProfilePic = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            // Get extra data included in the Intent

            if (managerWagona.getStringDetail(VPROFILEIMAGE).length() != 0) {
                Glide.with(getApplicationContext())
                        .load(managerWagona.getStringDetail(IMAGEPATH) + managerWagona.getStringDetail(VPROFILEIMAGE))
                        .placeholder(R.drawable.social_channels)
                        .transform(new CircleTransform(getApplicationContext()))
                        .into(userImage);
            }

            txtUserName.setText(managerWagona.getStringDetail(FIRSTNAME) + " " + managerWagona.getStringDetail(SURNAME));

        }
    };

    @Override
    protected void onDestroy() {
        // Unregister since the activity is about to be closed.
        LocalBroadcastManager.getInstance(this).unregisterReceiver(mUpdateProfilePic);
        super.onDestroy();
    }

    private TextView textEditProfile;
    private TextView textAboutUs;
    private TextView textHowitWorks;
    private TextView textContactUs;
    private TextView textLogout;
    private TextView textPaypal;

    private TextView txtUserName;
    private ImageView userImage;


    View.OnClickListener mEditProfileListner = new View.OnClickListener() {
        @Override
        public void onClick(View v) {

            if (v == userImage || v == txtUserName) {
                drawer.closeDrawers();
                Intent intent = new Intent(HomeActivity.this, EditProfileActivity.class);
                startActivity(intent);

            }

        }
    };


    private void initNavigationDrawer() {

        textEditProfile = (TextView) navigationView.findViewById(R.id.textEditProfile);
        textAboutUs = (TextView) navigationView.findViewById(R.id.textAboutUs);
        textHowitWorks = (TextView) navigationView.findViewById(R.id.textHowitWorks);
        textContactUs = (TextView) navigationView.findViewById(R.id.textContactUs);
        textLogout = (TextView) navigationView.findViewById(R.id.textLogout);

        textPaypal = (TextView) navigationView.findViewById(R.id.textPaypal);


        txtUserName = (TextView) navigationView.findViewById(R.id.txtUserName);
        userImage = (ImageView) navigationView.findViewById(R.id.userImage);

        userImage.setOnClickListener(mEditProfileListner);
        txtUserName.setOnClickListener(mEditProfileListner);

        if (managerWagona.getStringDetail(VPROFILEIMAGE).length() != 0) {
            Glide.with(getApplicationContext())
                    .load(managerWagona.getStringDetail(IMAGEPATH) + managerWagona.getStringDetail(VPROFILEIMAGE))
                    .placeholder(R.drawable.social_channels)
                    .transform(new CircleTransform(getApplicationContext()))
                    .into(userImage);
        }

        txtUserName.setText(managerWagona.getStringDetail(FIRSTNAME) + " " + managerWagona.getStringDetail(SURNAME));


        textLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                mDatabasehelper.openDataBase();
                mDatabasehelper.deleteAllTimeStamp();
                mDatabasehelper.close();


                drawer.closeDrawers();
                managerWagona.clearAllSP();

                Intent intent = new Intent(HomeActivity.this, SignInActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                finish();

            }
        });


        textEditProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                drawer.closeDrawers();
                Intent intent = new Intent(HomeActivity.this, EditProfileActivity.class);
                startActivity(intent);

            }
        });

        textAboutUs.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                drawer.closeDrawers();
                Intent intent = new Intent(HomeActivity.this, AboutUsActivity.class);
                startActivity(intent);

            }
        });

        textHowitWorks.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                drawer.closeDrawers();
                Intent intent = new Intent(HomeActivity.this, HowItWorksActivity.class);
                startActivity(intent);

            }
        });

        textContactUs.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                drawer.closeDrawers();
                Intent intent = new Intent(HomeActivity.this, ContactUsActivity.class);
                startActivity(intent);


            }
        });


       /* if (managerWagona.getStringDetail(PAYMENT_STATUS).equalsIgnoreCase("NOT-COMPLETE")) {
            textPaypal.setVisibility(View.VISIBLE);
        } else {
            textPaypal.setVisibility(View.GONE);
        }
*/

        /*textPaypal.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                drawer.closeDrawers();
                //TODO paypal activity here

                //callPayPal();
                asasa
                Intent intent = new Intent(HomeActivity.this, UpgradeAccountActivity.class);
                startActivity(intent);


            }
        });*/

        callDashBoardApi();


    }


    private void setTabViewPagerData() {
//        Toast.makeText(getApplicationContext(), ""+mTestDetailses.size(), Toast.LENGTH_LONG).show();

        for (int i = 0; i < mTestDetailses.size(); i++) {
            tabLayout.getTabAt(i).setCustomView(R.layout.tab_textview);

            if (i == 0) {
                TextView mTextView = (TextView) (tabLayout.getTabAt(i).getCustomView()).findViewById(R.id.textTab);
                mTextView.setTextColor(getResources().getColor(R.color.colorPrimaryDark));
                mTextView.setTypeface(Typeface.createFromAsset(getAssets(), "fonts/trebucbd_0.ttf"));
                mTextView.setTextSize(18);
                mTextView.setText(mTestDetailses.get(i).getDescription());
                tabLayout.getTabAt(0).getCustomView().setSelected(true);
            } else {
                ((TextView) (tabLayout.getTabAt(i).getCustomView()).findViewById(R.id.textTab)).setText(mTestDetailses.get(i).getDescription());
            }


        }

        tabLayout.setOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {

                TextView mTextView = (TextView) (tab.getCustomView()).findViewById(R.id.textTab);
                mTextView.setTextColor(getResources().getColor(R.color.colorPrimaryDark));
                mTextView.setTypeface(Typeface.createFromAsset(getAssets(), "fonts/trebucbd_0.ttf"));
                mTextView.setTextSize(18);

                viewPager.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

                TextView mTextView = (TextView) (tab.getCustomView()).findViewById(R.id.textTab);
                mTextView.setTypeface(Typeface.createFromAsset(getAssets(), "fonts/trebuc_0.ttf"));
                mTextView.setTextSize(15);
                mTextView.setTextColor(getResources().getColor(R.color.dark_font));


            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
    }


    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    ViewPagerAdapter adapter = null;

    private void setupViewPager(ViewPager viewPager) {
        adapter = new ViewPagerAdapter(getSupportFragmentManager());
        int limit = (mTestDetailses.size() > 1 ? mTestDetailses.size() - 1 : 1);
        viewPager.setAdapter(adapter);
        viewPager.setOffscreenPageLimit(limit);

    }

    String dialogMessageText = "";

    public void setButtonValue(int upgradeShowFlag, String dialogMessage, String paymentStatus) {


        if (paymentStatus.equalsIgnoreCase("NOT-COMPLETE")) {

            if (upgradeShowFlag == 0) {
                if (dialogMessage.equals("")){
                    imgUpgrade.setVisibility(View.GONE);
                    textPaypal.setVisibility(View.GONE);
                } else {
                    imgUpgrade.setVisibility(View.VISIBLE);
                    textPaypal.setVisibility(View.VISIBLE);
                    textPaypal.setText("Upgrade Account");
                    textPaypal.setTag(0);
                    imgUpgrade.setTag(0);
                    dialogMessageText = dialogMessage;
                }

            } else if (upgradeShowFlag == 3) {
                if (dialogMessage.equals("")){
                    imgUpgrade.setVisibility(View.GONE);
                    textPaypal.setVisibility(View.GONE);
                } else {
                    textPaypal.setVisibility(View.GONE);
                    imgUpgrade.setVisibility(View.VISIBLE);
                    imgUpgrade.setTag(2);
                    dialogMessageText = dialogMessage;
                }
            } else {
                imgUpgrade.setVisibility(View.GONE);
                textPaypal.setVisibility(View.GONE);
            }
        } else if (paymentStatus.equalsIgnoreCase("COMPLETE")) {

            if (upgradeShowFlag == 1) {
                imgUpgrade.setVisibility(View.GONE);
                textPaypal.setVisibility(View.VISIBLE);
                textPaypal.setText("Unsubscribe");
                textPaypal.setTag(1);
                imgUpgrade.setTag(1);
                dialogMessageText = dialogMessage;
            } else if (upgradeShowFlag == 2) {
//                imgUpgrade.setVisibility(View.VISIBLE);
                imgUpgrade.setVisibility(View.GONE);
                textPaypal.setVisibility(View.GONE);
                textPaypal.setText("");
                textPaypal.setTag(2);
                imgUpgrade.setTag(2);
                dialogMessageText = dialogMessage;

            } else {
                imgUpgrade.setVisibility(View.GONE);
                textPaypal.setVisibility(View.GONE);
            }

            //1

        } else if (paymentStatus.equalsIgnoreCase("WAIVED")) {
            if (upgradeShowFlag == 0) {
//                imgUpgrade.setVisibility(View.VISIBLE);
                imgUpgrade.setVisibility(View.GONE);
                textPaypal.setVisibility(View.GONE);
                textPaypal.setText("");
                textPaypal.setTag(2);
                imgUpgrade.setTag(2);
                dialogMessageText = dialogMessage + getResources().getString(R.string.msg_expire_acc_half);
            } else {
                imgUpgrade.setVisibility(View.GONE);
                textPaypal.setVisibility(View.GONE);
            }


        } else {
            imgUpgrade.setVisibility(View.GONE);
            textPaypal.setVisibility(View.GONE);
        }

        imgUpgrade.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if ((int) imgUpgrade.getTag() == 0) {
                    showUpgradeDialog(dialogMessageText);
                } else if ((int) imgUpgrade.getTag() == 1) {
                    showCancelSubcriptionDialog(dialogMessageText);
                } else if ((int) imgUpgrade.getTag() == 2) {

                    showMessageDialog(dialogMessageText);
                }


            }
        });

        textPaypal.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                drawer.closeDrawers();

                if ((int) textPaypal.getTag() == 0) {
                    showUpgradeDialog(dialogMessageText);
                } else if ((int) textPaypal.getTag() == 1) {
                    showCancelSubcriptionDialog(dialogMessageText);
                } else if ((int) textPaypal.getTag() == 2) {
                    showMessageDialog(dialogMessageText);
                }
            }
        });


    }

    private void showMessageDialog(String dialogMessageText) {

        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(HomeActivity.this);
        alertDialogBuilder.setTitle(R.string.app_name);
        alertDialogBuilder
                .setMessage(dialogMessageText)
                .setCancelable(false)
                .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {

                    }
                });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();

    }


    //View pager
    class ViewPagerAdapter extends FragmentPagerAdapter {

        public ViewPagerAdapter(FragmentManager manager) {
            super(manager);
        }

        @Override
        public Fragment getItem(int position) {

            Form1Fragment mForm1Fragment = new Form1Fragment();
            Bundle mBundle = new Bundle();
            mBundle.putSerializable("MyObject", mTestDetailses.get(position));
            mForm1Fragment.setArguments(mBundle);
            return mForm1Fragment;
        }

        @Override
        public int getCount() {
            return mTestDetailses.size();
        }

       /* public void addFragment(Fragment fragment, String title) {
            mFragmentList.add(fragment);
            mFragmentTitleList.add(title);
        }*/

        @Override
        public CharSequence getPageTitle(int position) {
            return "";
        }

    }

    /**
     * Call dashboard api to get all form
     */

    List<TestDetails> mTestDetailses = new ArrayList<>();

    private void callDashBoardApi() {

        if (!isNetworkAvailable(this)) {

            goOfflineDashBoard();

            return;

        }
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_MYTEST_LATEST, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                Log.e("TAG","Responce: "+response);
                parseResponseDashboard(response);
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
                params.put("account_id", managerWagona.getStringDetail(ACCOUNT_ID));
                //params.put(USER_ID, "677");
                params = SecurityUtils.setSecureParams(params);
                Log.e("TAG","Prams: "+params);
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

    private void goOfflineDashBoard() {

        mDatabasehelper.openDataBase();
        String response = mDatabasehelper.getDashBoardData();
        mDatabasehelper.close();

        if (!response.equalsIgnoreCase("0")) {
            parseResponseDashboard(response);
        } else {
            showOkDialog(HomeActivity.this, "No data for Dashboard. Please go online and get your dashboard data");
        }


    }

    private void parseResponseDashboard(String response) {

        try {
            JSONObject mJsonObject = new JSONObject(response);

            if (mJsonObject.getInt(STATUS) == 1) {

                mDatabasehelper.openDataBase();
                mDatabasehelper.insertDashBoardData(response);
                mDatabasehelper.close();

                int upgradeShowFlag = mJsonObject.getJSONObject("upgrade_flag").getInt("flag");

                dialogMessage = mJsonObject.getJSONObject("upgrade_flag").getString("subscription_status");

                String paymentStatus = mJsonObject.getJSONObject("upgrade_flag").getString(PAYMENT_STATUS);

                Log.d("FLAG: ", "Flag: "+String.valueOf(upgradeShowFlag)+"  dialogMessage: "+dialogMessage+
                        "  paymentStatus: "+paymentStatus);

                managerWagona.setStringDetail(PAYMENT_STATUS, paymentStatus);

                setButtonValue(upgradeShowFlag, dialogMessage, paymentStatus);


                Gson gson = new Gson();
                Type listType = new TypeToken<List<TestDetails>>() {
                }.getType();
                mTestDetailses = (List<TestDetails>) gson.fromJson(new JSONObject(response).getString("test_details"), listType);


                setupViewPager(viewPager);
                tabLayout.setupWithViewPager(viewPager);

                adapter.notifyDataSetChanged();
                setTabViewPagerData();

            } else {
                showOkDialog(HomeActivity.this, mJsonObject.getString(MESSAGE));
            }


        }/* catch (Exception e) {
            e.printStackTrace();
        }*/ catch (JSONException e) {
            Log.e("JSON Parser", "Error parsing data [" + e.getMessage()+"] "+response);
        }


    }

    private void showRetryDialog(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                HomeActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callDashBoardApi();

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
     * Api for get subcription url and load it with new screen
     */
    private void callApiToCancelSubscribtion() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, CANCEL_PAYMENT_CHECK_URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //{"school_id":6,"success":"1","message":"You enquiry for school registration is sent successfully. your number is 6"}

                try {

                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt("response_code") == 200) {

                        showLoggedOutDialog(mJsonObject.getString("response_message"));


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
                params.put("account_id", managerWagona.getStringDetail(ACCOUNT_ID));
                // params = SecurityUtils.setSecureParams(params);


                return params;
            }

        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);


    }

    private void showLoggedOutDialog(String message) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(HomeActivity.this);
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));
        alertDialogBuilder
                .setMessage(message)
                .setCancelable(false)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        loggedOut();

                    }
                });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }


    private void loggedOut() {

        mDatabasehelper.openDataBase();
        mDatabasehelper.deleteAllTimeStamp();
        mDatabasehelper.close();

        managerWagona.clearAllSP();

        Intent intent = new Intent(HomeActivity.this, SignInActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finishAffinity();
    }


}
