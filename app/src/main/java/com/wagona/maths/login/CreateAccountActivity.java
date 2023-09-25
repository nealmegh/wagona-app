package com.wagona.maths.login;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.Toolbar;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.wagona.maths.AppController;
import com.wagona.maths.BaseActivity;
import com.wagona.maths.R;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.WagonaApp;
import com.wagona.maths.model.SyllabusBean;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sotsys-159 on 12/4/16.
 */
public class CreateAccountActivity extends BaseActivity {

    //get Form list

    HashMap<String, String> mSubjectMap = new HashMap<>();
    List<String> mSubjectsList = new ArrayList<>();
    String mSubjectID = null;

    //get Country list

    HashMap<String, String> mCountryMap = new HashMap<>();
    List<String> mCountryList = new ArrayList<>();
    String mCountryID = null;

    //get SyllabusID list
    ArrayList<SyllabusBean> mSyllabusList = new ArrayList<>();
    String mSyllabusID = null;

    private Toolbar toolbar;


    private EditText txtName;
    private EditText txtSurname;
    private EditText textEmail;
    private EditText textPassword;
    private EditText textConfPassword;
    private EditText textMobile;

    private TextView textBtnSignUp;

    private Spinner spinnerForms, spinnerCountry, spinnerSyllabus;
    private RelativeLayout rlSubject;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_create_acc);
        setScreenToolbar();
        initControls();
    }


    private void setScreenToolbar() {
        toolbar = (Toolbar) findViewById(R.id.headerStrip);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        textHeader.setText("Sign Up");


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

    private void initControls() {


        txtName = (EditText) findViewById(R.id.txtName);
        txtSurname = (EditText) findViewById(R.id.txtSurname);
        textEmail = (EditText) findViewById(R.id.textEmail);
        textPassword = (EditText) findViewById(R.id.textPassword);
        textConfPassword = (EditText) findViewById(R.id.textConfPassword);
        textMobile = (EditText) findViewById(R.id.textMobile);
        spinnerForms = (Spinner) findViewById(R.id.spinnerForms);
        spinnerCountry = (Spinner) findViewById(R.id.spinnerCountry);
        spinnerSyllabus = (Spinner) findViewById(R.id.spinnerSyllabus);

        rlSubject = (RelativeLayout) findViewById(R.id.rlSubject);

        (findViewById(R.id.signUpRedirectLayout)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //sign up screen

                Intent intent = new Intent(CreateAccountActivity.this, SignInActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);


            }
        });

        textBtnSignUp = (TextView) findViewById(R.id.textBtnSignUp);
        textBtnSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (isValidate()) {
                    callCreateAccountApi();
                }

            }
        });


//        callSubjectListApi();

        callCountryListApi();
    }

    private void setFormListAdapter() {

        mSubjectID = mSubjectMap.get(mSubjectsList.get(0));

        ArrayAdapter<String> formAdapter = new ArrayAdapter<String>(this,
                R.layout.item_show_spinner_1, mSubjectsList);
        formAdapter.setDropDownViewResource(R.layout.item_spinner_1);
        spinnerForms.setAdapter(formAdapter);

        spinnerForms.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

                mSubjectID = mSubjectMap.get(mSubjectsList.get(position));

            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }

    private void setCountryListAdapter() {

        mCountryID = mCountryMap.get(mCountryList.get(0));

        ArrayAdapter<String> formAdapter = new ArrayAdapter<String>(this,
                R.layout.item_show_spinner_1, mCountryList);
        formAdapter.setDropDownViewResource(R.layout.item_spinner_1);
        spinnerCountry.setAdapter(formAdapter);

        spinnerCountry.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                mCountryID = mCountryMap.get(mCountryList.get(position));
                callSyllabusListApi();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }

    private void setSyllabusListAdapter() {

        mSyllabusID = mSyllabusList.get(0).getSyllabusId();

        String[] arraySyllabus = new String[mSyllabusList.size()];
        int i = 0;
        for (SyllabusBean syllabusBean : mSyllabusList) {
            arraySyllabus[i++] = syllabusBean.getDescription();
        }

        ArrayAdapter<String> formAdapter = new ArrayAdapter<String>(this,
                R.layout.item_show_spinner_1, arraySyllabus);
        formAdapter.setDropDownViewResource(R.layout.item_spinner_1);
        spinnerSyllabus.setAdapter(formAdapter);

        spinnerSyllabus.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                mSyllabusID = mSyllabusList.get(position).getSyllabusId();

                if (mSyllabusList.get(position).isSubjectRequired() == null || mSyllabusList.get(position).isSubjectRequired().equals("0")) {
                    rlSubject.setVisibility(View.GONE);
                } else {
                    rlSubject.setVisibility(View.VISIBLE);
                    callSubjectListApi();
                }

            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }


    public boolean isValidate() {

        if (txtName.getText().toString().trim().length() == 0) {
            txtName.setError(getString(R.string.valid_name));
            return false;
        } else if (txtSurname.getText().toString().trim().length() == 0) {
            txtSurname.setError(getString(R.string.valid_surne));
            return false;
        } else if (textPassword.getText().toString().trim().length() == 0 ) {
            textPassword.setError(getString(R.string.valid_password));
            return false;
        } else if (textConfPassword.getText().toString().trim().length() == 0) {
            textConfPassword.setError(getString(R.string.valid_conf_password));
            return false;
        } else if (!textPassword.getText().toString().trim().equalsIgnoreCase(textConfPassword.getText().toString().trim())) {
            textConfPassword.setError(getString(R.string.valid_not_match));
            return false;
        } else if (textMobile.getText().toString().trim().length() == 0 || textMobile.getText().toString().trim().length() < 10) {
            textMobile.setError(getString(R.string.valid_mobile));
            return false;
        } else if (spinnerCountry.getSelectedItemPosition() == 0) {
            showOkDialog(CreateAccountActivity.this, getString(R.string.valid_country));
            return false;
        } else if (spinnerSyllabus.getSelectedItemPosition() == 0) {
            showOkDialog(CreateAccountActivity.this, getString(R.string.valid_syllabus));
            return false;
        } else if (spinnerForms.getSelectedItemPosition() == 0 && mSyllabusList.get(spinnerSyllabus.getSelectedItemPosition()).isSubjectRequired().equals("1")) {
            showOkDialog(CreateAccountActivity.this, getString(R.string.valid_form));
            return false;
        }


        return true;
    }


    private void callCreateAccountApi() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + STUDENT_SIGNUP, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //{"school_id":6,"success":"1","message":"You enquiry for school registration is sent successfully. your number is 6"}

                try {

                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        AlertDialog.Builder adb = new AlertDialog.Builder(CreateAccountActivity.this);
                        adb.setTitle(getResources().getString(R.string.app_name));
                        adb.setMessage(mJsonObject.getString(MESSAGE));
                        adb.setPositiveButton("Ok", new AlertDialog.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                                finish();

                                Intent intent = new Intent(CreateAccountActivity.this, SignInActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(intent);

                            }
                        });
                        adb.show();

                    } else {

                        showOkDialog(CreateAccountActivity.this, mJsonObject.getString(MESSAGE));
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }


                closeProgressDialog();

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("TAG", "VolleyError:" + error.toString());
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
                params.put(FNAME, txtName.getText().toString().trim());
                params.put(SNAME, txtSurname.getText().toString().trim());
                params.put(EMAIL, textEmail.getText().toString().trim());
                params.put(PASSWORD, textPassword.getText().toString().trim());
                params.put(MOBILE_NO, textMobile.getText().toString().trim());
                params.put(COUNTRY_ID, mCountryID);
                params.put(SYLLABUS_ID, mSyllabusID);

                if (mSubjectID != null)
                    params.put(SUBJECT_ID, mSubjectID);
                else
                    params.put(SUBJECT_ID, "");

                managerWagona.setStringDetail(PASSWORD, textPassword.getText().toString().trim());

                params.put(TYPE, "free");
                params.put(VDEVICETOKEN, "121212");
                params.put(EPLATFORM, "android");
                params.put(VDEVICEVERSION, "");
                params.put(VDEVICENAME, "");
                params.put(IBADGECOUNT, "");
                params = SecurityUtils.setSecureParams(params);

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
                CreateAccountActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callCreateAccountApi();

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


    private void callSubjectListApi() {

        if (mSyllabusID.equals("0")) {
            mSubjectsList.add(0, "Select Form/Level");
            mSubjectMap.put("Select Form/Level", "0");
            setFormListAdapter();
            return;
        }


        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");
        mSubjectMap.clear();
        mSubjectsList.clear();
        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_SUBJECTS, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //{"school_id":6,"success":"1","message":"You enquiry for school registration is sent successfully. your number is 6"}

                try {

                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        JSONArray mJsonArray = mJsonObject.getJSONArray("Subjects");

                        for (int i = 0; i < mJsonArray.length(); i++) {
                            mSubjectsList.add(mJsonArray.getJSONObject(i).getString("description"));
                            mSubjectMap.put(mJsonArray.getJSONObject(i).getString("description"), mJsonArray.getJSONObject(i).getString("subject_id"));
                        }

                        mSubjectsList.add(0, "Select Form/Level");
                        mSubjectMap.put("Select Form/Level", "0");

                        setFormListAdapter();
                    } else {

                        showOkDialog(CreateAccountActivity.this, mJsonObject.getString(MESSAGE));
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
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {

                Map<String, String> params = new HashMap<String, String>();
                params = SecurityUtils.setSecureParams(params);
                params.put(SYLLABUS_ID, mSyllabusID);
                return params;
            }


        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }


    private void callCountryListApi() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");
        mCountryMap.clear();
        mCountryList.clear();

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_COUNTRY, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //{"school_id":6,"success":"1","message":"You enquiry for school registration is sent successfully. your number is 6"}

                try {

                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        JSONArray mJsonArray = mJsonObject.getJSONArray("Country");

                        for (int i = 0; i < mJsonArray.length(); i++) {
                            mCountryList.add(mJsonArray.getJSONObject(i).getString("description"));
                            mCountryMap.put(mJsonArray.getJSONObject(i).getString("description"), mJsonArray.getJSONObject(i).getString("country_id"));
                        }

                        mCountryList.add(0, "Select Country");
                        mCountryMap.put("Select Country", "0");

                        setCountryListAdapter();

                    } else {
                        showOkDialog(CreateAccountActivity.this, mJsonObject.getString(MESSAGE));
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
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {

                Map<String, String> params = new HashMap<String, String>();
                params = SecurityUtils.setSecureParams(params);
                return params;
            }


        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }


    private void callSyllabusListApi() {

        if (mCountryID.equals("0")) {
            SyllabusBean syllabusBean = new SyllabusBean();
            syllabusBean.setDescription("Select Syllabus");
            syllabusBean.setSyllabusId("0");
            mSyllabusList.add(0, syllabusBean);

            setSyllabusListAdapter();
            return;
        }

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");
        mSyllabusList.clear();

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_SYLLABUS, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //{"school_id":6,"success":"1","message":"You enquiry for school registration is sent successfully. your number is 6"}

                try {

                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        JSONArray mJsonArray = mJsonObject.getJSONArray("Syllabus");

                        for (int i = 0; i < mJsonArray.length(); i++) {

                            SyllabusBean syllabusBean = new SyllabusBean();
                            syllabusBean.setDescription(mJsonArray.getJSONObject(i).getString("description"));
                            syllabusBean.setSyllabusId(mJsonArray.getJSONObject(i).getString("syllabus_id"));
                            syllabusBean.setSubjectRequired(mJsonArray.getJSONObject(i).getString("subject_required"));
                            mSyllabusList.add(syllabusBean);
                        }


                        SyllabusBean syllabusBean = new SyllabusBean();
                        syllabusBean.setDescription("Select Syllabus");
                        syllabusBean.setSyllabusId("0");
                        mSyllabusList.add(0, syllabusBean);

                        setSyllabusListAdapter();

                    } else {
                        showOkDialog(CreateAccountActivity.this, mJsonObject.getString(MESSAGE));
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
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {

                Map<String, String> params = new HashMap<String, String>();
                params = SecurityUtils.setSecureParams(params);
                params.put(COUNTRY_ID, mCountryID);
                return params;
            }


        };
        AppController.getInstance(this).addToRequestQueue(mStringRequest);
    }
}
