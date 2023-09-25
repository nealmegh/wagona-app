package com.wagona.maths.login;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
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

import co.lujun.androidtagview.TagContainerLayout;
import co.lujun.androidtagview.TagView;

/**
 * Created by sotsys-159 on 12/4/16.
 */
public class RegisterSchoolActivity extends BaseActivity {

    private int RC_SELECT_SYLLABUS = 95;

    private EditText textSchoolName;
    private EditText textAddress1;
    private EditText textAddress2;
    private EditText textAdminContact;
    private EditText textTelephone;
    private EditText textWebUrl;
    private EditText textNumStudents;

    private TextView textBtnRegister;


    //get Country list

    private HashMap<String, String> mCountryMap = new HashMap<>();
    private List<String> mCountryList = new ArrayList<>();
    private String mCountryID = null;

    private Spinner spinnerCountry;

    //get SyllabusID list
    private String mSyllabusID = null;
    private TagContainerLayout mSyllabusContainerLayout;
    private ArrayList<SyllabusBean> mSyllabusList = new ArrayList<>();
    private List<String> arraySyllabus = new ArrayList<>();
    private TextView textSelectSyllabus;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reg_school);
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
        textHeader.setText("Sign Up");


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }


    private void initControls() {

        textSchoolName = (EditText) findViewById(R.id.textSchoolName);
        textAddress1 = (EditText) findViewById(R.id.textAddress1);
        textAddress2 = (EditText) findViewById(R.id.textAddress2);
        textAdminContact = (EditText) findViewById(R.id.textAdminContact);
        textTelephone = (EditText) findViewById(R.id.textTelephone);
        textWebUrl = (EditText) findViewById(R.id.textWebUrl);
        textNumStudents = (EditText) findViewById(R.id.textNumStudents);
        textSelectSyllabus = (TextView) findViewById(R.id.textSelectSyllabus);

        spinnerCountry = (Spinner) findViewById(R.id.spinnerCountry);

        (findViewById(R.id.signUpRedirectLayout)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //sign up screen

                Intent intent = new Intent(RegisterSchoolActivity.this, SignInActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);


            }
        });

        textBtnRegister = (TextView) findViewById(R.id.textBtnRegister);
        textBtnRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (isValidate()) {
                    callSchoolSignUpApi();
                }
            }
        });

        textSelectSyllabus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (mSyllabusList.size() == 0) {
                    showOkDialog(RegisterSchoolActivity.this, getString(R.string.valid_country));
                    return;
                }

                Intent iAddService = new Intent(RegisterSchoolActivity.this, SearchSyllabusActivity.class);
                iAddService.putExtra("data", mSyllabusList);
                startActivityForResult(iAddService, RC_SELECT_SYLLABUS);
            }
        });

        mSyllabusContainerLayout = (TagContainerLayout) findViewById(R.id.syllabusContainerLayout);
        mSyllabusContainerLayout.setTags(arraySyllabus);

        mSyllabusContainerLayout.setOnTagClickListener(new TagView.OnTagClickListener() {
            @Override
            public void onTagClick(int position, String text) {

            }

            @Override
            public void onTagLongClick(int position, String text) {

            }

            @Override
            public void onTagCrossClick(int position) {
                for (SyllabusBean syllabusBean : mSyllabusList) {
                    if (syllabusBean.getDescription().equals(arraySyllabus.get(position)))
                        syllabusBean.setSelected(false);
                }
                mSyllabusContainerLayout.removeTag(position);
                arraySyllabus.remove(position);
            }
        });

        callCountryListApi();
    }

    public boolean isValidate() {

        if (textSchoolName.getText().toString().trim().length() == 0) {
            textSchoolName.setError(getString(R.string.valid_school_name));
            return false;
        } else if (textAddress1.getText().toString().trim().length() == 0) {
            textAddress1.setError(getString(R.string.valid_address_1));
            return false;
        } else if (textAddress2.getText().toString().trim().length() == 0) {
            textAddress2.setError(getString(R.string.valid_address_2));
            return false;
        } else if (textAdminContact.getText().toString().trim().length() == 0 || textAdminContact.getText().toString().trim().length() < 10) {
            textAdminContact.setError(getString(R.string.valid_admin_contact));
            return false;
        } else if (textTelephone.getText().toString().trim().length() == 0 || textTelephone.getText().toString().trim().length() < 10) {
            textTelephone.setError(getString(R.string.valid_telephone));
            return false;
        } else if (textWebUrl.getText().toString().trim().length() == 0) {
            textWebUrl.setError(getString(R.string.valid_web_url));
            return false;
        } else if (textNumStudents.getText().toString().trim().length() == 0) {
            textNumStudents.setError(getString(R.string.valid_number_student));
            return false;
        } else if (spinnerCountry.getSelectedItemPosition() == 0) {
            showOkDialog(RegisterSchoolActivity.this, getString(R.string.valid_country));
            return false;
        } else if (mSyllabusContainerLayout.getTags().size() == 0) {
            showOkDialog(RegisterSchoolActivity.this, getString(R.string.valid_syllabus));
            return false;
        }

        return true;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SELECT_SYLLABUS) {
            if (resultCode == RESULT_OK) {

                Bundle extras = data.getExtras();

                ArrayList<SyllabusBean> temp = extras.getParcelableArrayList("data");

                mSyllabusList.clear();
                mSyllabusList.addAll(temp);

                for (SyllabusBean innerService : temp) {

                    if (!arraySyllabus.contains(innerService.getDescription())) {
                        arraySyllabus.add(innerService.getDescription());
                        mSyllabusContainerLayout.addTag(innerService.getDescription());
                    }
                }

            }
        }
    }

    private void callSchoolSignUpApi() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + SCHOOL_SIGNUP, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //{"school_id":6,"success":"1","message":"You enquiry for school registration is sent successfully. your number is 6"}

                try {

                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {


                        AlertDialog.Builder adb = new AlertDialog.Builder(RegisterSchoolActivity.this);
                        adb.setTitle(getResources().getString(R.string.app_name));
                        adb.setMessage(mJsonObject.getString(MESSAGE));
                        adb.setPositiveButton("Ok", new AlertDialog.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                                finish();

                                Intent intent = new Intent(RegisterSchoolActivity.this, SignInActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(intent);
                            }
                        });
                        adb.show();

                    } else {

                        showOkDialog(RegisterSchoolActivity.this, mJsonObject.getString(MESSAGE));
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
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }
        }) {
            @Override
            protected Map<String, String> getParams() {

                Map<String, String> params = new HashMap<String, String>();
                params.put(SCHOOL_NAME, textSchoolName.getText().toString().trim());
                params.put(ADDRESS_1, textAddress1.getText().toString().trim());
                params.put(ADDRESS_2, textAddress2.getText().toString().trim());
                params.put(ADMIN_CONTACT, textAdminContact.getText().toString().trim());
                params.put(TELEPHONE_NUM, textTelephone.getText().toString().trim());
                params.put(WEBSITE_URL, textWebUrl.getText().toString().trim());
                params.put(NUM_STUDENTS, textNumStudents.getText().toString().trim());
                params.put("country_name", spinnerCountry.getSelectedItem().toString());

                String selectedSyllabus = "";

                for (SyllabusBean syllabusBean : mSyllabusList) {

                    if (syllabusBean.isSelected()) {
                        selectedSyllabus += syllabusBean.getDescription() + ",";
                    }
                }

                if (!selectedSyllabus.isEmpty()) {
                    selectedSyllabus = selectedSyllabus.substring(0, selectedSyllabus.length() - 1);
                }

                params.put("syllabus_name", selectedSyllabus);

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
                        showOkDialog(RegisterSchoolActivity.this, mJsonObject.getString(MESSAGE));
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

    private void callSyllabusListApi() {

        if (mCountryID.equals("0")) {
            return;
        }

        mSyllabusList.clear();
        arraySyllabus.clear();
        mSyllabusContainerLayout.removeAllTags();

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

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
                            syllabusBean.setSyllabusId(mJsonArray.getJSONObject(i).getString("syllabus_id"));
                            syllabusBean.setDescription(mJsonArray.getJSONObject(i).getString("description"));
                            mSyllabusList.add(syllabusBean);
                        }


                    } else {
                        showOkDialog(RegisterSchoolActivity.this, mJsonObject.getString(MESSAGE));
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
