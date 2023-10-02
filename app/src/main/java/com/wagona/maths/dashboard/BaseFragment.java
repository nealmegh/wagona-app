package com.wagona.maths.dashboard;


import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import com.wagona.maths.R;
import com.wagona.maths.Utils.AppParameter;
import com.wagona.maths.Utils.SessionManagerWagona;

/**
 * Created by sotsys-159 on 25/4/16.
 */
public class BaseFragment extends Fragment implements AppParameter{

    public BaseFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        baseUrl = getString(R.string.base_url);
        managerWagona = new SessionManagerWagona(getActivity());
    }

    private ProgressDialog mProgressDialog = null;
    public SessionManagerWagona managerWagona = null;
    private String baseUrl;

    public void closeKeyboard(boolean b) {

        View view = getActivity().getCurrentFocus();

        if (b) {
            if (view != null) {
                InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
        } else {
            InputMethodManager imm = (InputMethodManager)getActivity(). getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.showSoftInput(view, 0);
        }
    }


    public void showProgressDialog(String message) {

        mProgressDialog = new ProgressDialog(getActivity());
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
                getActivity().finish();
            }
        });
        adb.show();

    }



    public boolean preApiCallChecking() {

        closeKeyboard(true);
        if (isNetworkAvailable(getActivity())) {
            return true;
        } else {
            showOkDialog(getActivity(), getResources().getString(R.string.no_network));
            return false;
        }

    }

    public static boolean isNetworkAvailable(Context mContext) {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) mContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }


    public final static boolean isValidEmail(CharSequence target) {
        if (target == null) {
            return false;
        } else {
            return android.util.Patterns.EMAIL_ADDRESS.matcher(target).matches();
        }
    }


}
