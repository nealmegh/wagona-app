package com.wagona.maths;

import android.content.Context;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.wagona.maths.Utils.AppParameter;
import com.wagona.maths.Utils.Databasehelper;
import com.wagona.maths.Utils.SessionManagerWagona;

/**
 * Created by sotsys-159 on 12/4/16.
 */
public abstract class BaseActivity extends AppCompatActivity implements AppParameter {

    public Databasehelper mDatabasehelper;


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        baseUrl = getString(R.string.base_url);
        managerWagona = new SessionManagerWagona(this);

        mDatabasehelper = new Databasehelper(this);
    }

    private ProgressDialog mProgressDialog = null;
    public SessionManagerWagona managerWagona = null;
    private String baseUrl;

    public void closeKeyboard(boolean b) {

        View view = this.getCurrentFocus();

        if (b) {
            if (view != null) {
                InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
        } else {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.showSoftInput(view, 0);
        }
    }


    public void showProgressDialog(String message) {
        mProgressDialog = new ProgressDialog(this);
        mProgressDialog.setMessage(message);
        mProgressDialog.setCancelable(false);
        mProgressDialog.show();
    }


    public void closeProgressDialog() {

        if (null != mProgressDialog) {
            if (mProgressDialog.isShowing()) {
                mProgressDialog.dismiss();
                mProgressDialog = null;
            }
        }


    }

    public String getBaseUrl() {
        return baseUrl;
    }

         /* =================================================================== */

    /**
     * showOkDialog : It's a Warning or Information dialog.
     */
    /* =================================================================== */
    public void showOkDialog(Context context, String message) {
        AlertDialog.Builder adb = new AlertDialog.Builder(context);
        adb.setTitle(context.getResources().getString(R.string.app_name));
        adb.setMessage(message);
        adb.setPositiveButton("Ok", new AlertDialog.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        adb.show();

    }

    public void showOkDialogClose(Context context, String message) {
        AlertDialog.Builder adb = new AlertDialog.Builder(context);
        adb.setTitle(context.getResources().getString(R.string.app_name));
        adb.setMessage(message);
        adb.setPositiveButton("Ok", new AlertDialog.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                finish();
            }
        });
        adb.show();

    }



    public boolean preApiCallChecking() {

        closeKeyboard(true);
        if (isNetworkAvailable(this)) {
            return true;
        } else {
            showOkDialog(this, getResources().getString(R.string.no_network));
            return false;
        }

    }

//    public static boolean isNetworkAvailable(Context mContext) {
//        ConnectivityManager connectivityManager
//                = (ConnectivityManager) mContext.getSystemService(Context.CONNECTIVITY_SERVICE);
//        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
//        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
//    }
    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

        if (connectivityManager != null) {
            NetworkRequest networkRequest = new NetworkRequest.Builder()
                    .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                    .build();

            ConnectivityManager.NetworkCallback networkCallback = new ConnectivityManager.NetworkCallback() {
                @Override
                public void onAvailable(Network network) {
                    // Network is available
                }

                @Override
                public void onLost(Network network) {
                    // Network is lost
                }
            };

            connectivityManager.registerNetworkCallback(networkRequest, networkCallback);

            NetworkCapabilities capabilities = connectivityManager.getNetworkCapabilities(connectivityManager.getActiveNetwork());
            return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
        }

        return false;
    }




public static boolean isValidEmail(CharSequence target) {
        if (target == null) {
            return false;
        } else {
            return android.util.Patterns.EMAIL_ADDRESS.matcher(target).matches();
        }
    }


}
