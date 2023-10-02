package com.wagona.maths.profileinfo;

import android.Manifest;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.os.Bundle;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.bumptech.glide.Glide;
import com.wagona.maths.AppController;
import com.wagona.maths.BaseActivity;
import com.wagona.maths.R;
import com.wagona.maths.Utils.CircleTransform;
import com.wagona.maths.Utils.MultipartRequest;
import com.wagona.maths.Utils.PickImager;
import com.wagona.maths.Utils.RunTimePermission;
import com.wagona.maths.Utils.SecurityUtils;
import com.wagona.maths.Utils.TakeImages;
import com.wagona.maths.WagonaApp;
import com.wagona.maths.login.CreateAccountActivity;
import com.wagona.maths.model.CountryBean;
import com.wagona.maths.model.SubjectBean;
import com.wagona.maths.model.SyllabusBean;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EditProfileActivity extends BaseActivity {

    private TextView imageButtonSignIn;
    private EditText editUserEmail, editName, editSurname;
    private EditText editUserNumber;
    private EditText editUserPassword;
    private EditText editUserConfirmPassword;
    private ImageView imgProfilePicture;
    private TextView textUserName;
    private PickImager mPikImager;
    private File file;
    private String[] dialogArray = {"Camera", "Gallary"};
    private static final int REQUEST_STORAGE = 0;
    private static String[] PERMISSIONS_STORAGE = {Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE};

    //get Country list
    ArrayList<CountryBean> mCountryList = new ArrayList<>();
    String mCountryID = null;

    //get SyllabusID list
    ArrayList<SyllabusBean> mSyllabusList = new ArrayList<>();
    String mSyllabusID = null;

    //get SyllabusID list
    ArrayList<SubjectBean> mSubjectsList = new ArrayList<>();
    String mSubjectID = null;

    private Spinner spinnerForms, spinnerCountry, spinnerSyllabus;
    private RelativeLayout rlSubject;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile);
        setScreenToolbar();
        initControls();
        setDataToControl();
    }


    private Toolbar toolbar;

    private void setScreenToolbar() {
        toolbar = (Toolbar) findViewById(R.id.headerStrip);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        textHeader.setText("Edit Profile");
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

    private void initControls() {

        runTimePermission = new RunTimePermission(this);

        imageButtonSignIn = (TextView) findViewById(R.id.imageButtonSignIn);
        editUserEmail = (EditText) findViewById(R.id.editUserEmail);
        editName = (EditText) findViewById(R.id.editName);
        editSurname = (EditText) findViewById(R.id.editSurname);
        editUserNumber = (EditText) findViewById(R.id.editUserNumber);
        editUserPassword = (EditText) findViewById(R.id.editUserPassword);
        editUserConfirmPassword = (EditText) findViewById(R.id.editUserConfirmPassword);
        imgProfilePicture = (ImageView) findViewById(R.id.imgProfilePicture);
        textUserName = (TextView) findViewById(R.id.textUserName);
        spinnerForms = (Spinner) findViewById(R.id.spinnerForms);
        spinnerCountry = (Spinner) findViewById(R.id.spinnerCountry);
        spinnerSyllabus = (Spinner) findViewById(R.id.spinnerSyllabus);

        rlSubject = (RelativeLayout) findViewById(R.id.rlSubject);

        mPikImager = new PickImager(this);

        imageButtonSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (isValidate())  // Check Validation  if any thing incorrect and blank
                {
                    callEditProfileApi();
                }
            }
        });
        imgProfilePicture.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // showDialog();

                closeKeyboard(true);
                runTimePermission.requestPermission(new String[]{Manifest.permission.CAMERA, Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, new RunTimePermission.RunTimePermissionListener() {

                    @Override
                    public void permissionGranted() {
                        Intent intent = new Intent(EditProfileActivity.this, TakeImages.class);
                        startActivityForResult(intent, IMAGE_REQUEST);
                    }

                    @Override
                    public void permissionDenied() {
                    }
                });


            }
        });


//        callSubjectListApi();
//        callCountryListApi();
    }

    private int IMAGE_REQUEST = 1256;

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == IMAGE_REQUEST && resultCode == RESULT_OK) {


            file = new File(data.getExtras().getString("image_url"));
            Glide.with(getApplicationContext())
                    .load(file)
                    .transform(new CircleTransform(getApplicationContext()))
                    .into(imgProfilePicture);
            imgProfilePicture.setVisibility(View.VISIBLE);

        }
    }

    private void setDataToControl() {

        textUserName.setText(managerWagona.getStringDetail(FIRSTNAME) + " " + managerWagona.getStringDetail(SURNAME));
        editUserEmail.setText(managerWagona.getStringDetail(USERNAME));
        editUserNumber.setText(managerWagona.getStringDetail(VMOBILENUMBER));
        editUserPassword.setText(managerWagona.getStringDetail(PASSWORD));
        editUserConfirmPassword.setText(managerWagona.getStringDetail(PASSWORD));

        editName.setText(managerWagona.getStringDetail(FIRSTNAME));
        editSurname.setText(managerWagona.getStringDetail(SURNAME));

        if (managerWagona.getStringDetail(VPROFILEIMAGE).length() != 0) {
            Glide.with(getApplicationContext())
                    .load(managerWagona.getStringDetail(IMAGEPATH) + managerWagona.getStringDetail(VPROFILEIMAGE))
                    .placeholder(R.drawable.social_channels)
                    .transform(new CircleTransform(getApplicationContext()))
                    .into(imgProfilePicture);
        }

    }


    RunTimePermission runTimePermission;


    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (runTimePermission != null) {
            runTimePermission.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    private void callEditProfileApi() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");

        Map<String, String> params = new HashMap<String, String>();

        params.put(USERNAME, editUserEmail.getText().toString().trim());
        params.put(USER_ID, managerWagona.getStringDetail(STUDENT_ID));
        params.put(MOBILE_NO, editUserNumber.getText().toString().trim());
        params.put(FIRSTNAME, editName.getText().toString().trim());
        params.put(SURNAME, editSurname.getText().toString().trim());
        params.put(OLD_PASSWORD, managerWagona.getStringDetail(PASSWORD));
        params.put(NEW_PASSWORD, editUserPassword.getText().toString().trim());
        params = SecurityUtils.setSecureParams(params);

//        params.put(COUNTRY_ID, mCountryID);
//        params.put(SYLLABUS_ID, mSyllabusID);
//
//        if (mSubjectID != null)
//            params.put(SUBJECT_ID, mSubjectID);
//        else
//            params.put(SUBJECT_ID, "");

        Log.e("param", params.toString());


        MultipartRequest mMultipartRequest = new MultipartRequest(getBaseUrl() + EDIT_PROFILE, new Response.Listener<String>() {

            @Override
            public void onResponse(String response) {

                try {

                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        JSONObject mDetailsObj = mJsonObject.getJSONObject("student_data");

                        managerWagona.setStringDetail(STUDENT_ID, mDetailsObj.getString(STUDENT_ID));
                        managerWagona.setStringDetail(FIRSTNAME, mDetailsObj.getString(FIRSTNAME));
                        managerWagona.setStringDetail(SURNAME, mDetailsObj.getString(SURNAME));
                        managerWagona.setStringDetail(USERNAME, mDetailsObj.getString(USERNAME));
                        managerWagona.setStringDetail(PARENT_EMAIL, mDetailsObj.getString(PARENT_EMAIL));
                        managerWagona.setStringDetail(PARENT_PHONE_NUM, mDetailsObj.getString(PARENT_PHONE_NUM));
                        managerWagona.setStringDetail(CLASS_ID, mDetailsObj.getString(CLASS_ID));
                        managerWagona.setStringDetail(VPROFILEIMAGE, mDetailsObj.getString(VPROFILEIMAGE));
                        managerWagona.setStringDetail(CREATED_AT, mDetailsObj.getString(CREATED_AT));
                        managerWagona.setStringDetail(UPDATED_AT, mDetailsObj.getString(UPDATED_AT));
                        managerWagona.setStringDetail(VMOBILENUMBER, mDetailsObj.getString(VMOBILENUMBER));
                        managerWagona.setStringDetail(PASSWORD, mDetailsObj.getString(PASSWORD));

                        managerWagona.setStringDetail(IMAGEPATH, mDetailsObj.getString(IMAGEPATH));
                        managerWagona.setStringDetail(VMOBILENUMBER, mDetailsObj.getString(VMOBILENUMBER));

                        managerWagona.setStringDetail(COUNTRY_ID, mDetailsObj.getString(COUNTRY_ID));
                        managerWagona.setStringDetail(SYLLABUS_ID, mDetailsObj.getString(SYLLABUS_ID));

                        showOkDialogClose(EditProfileActivity.this, mJsonObject.getString(MESSAGE));

                        callUpdateLocalBroadCast();


                    } else {

                        showOkDialog(EditProfileActivity.this, mJsonObject.getString(MESSAGE));
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }


                closeProgressDialog();

            }

        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("Volley Request Error", error.getLocalizedMessage());
                if (error.toString().contains("TimeoutError")) {
                    showRetryDialog(error.toString());
                }
                WagonaApp.getApp().setAPIErrorLog(error.networkResponse);
            }

        }, file, params);

        AppController.getInstance(this).addToRequestQueue(mMultipartRequest);

    }


    private void callUpdateLocalBroadCast() {


        Intent intent = new Intent("UpdateProfile");
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);


    }

    private void showRetryDialog(String error) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                EditProfileActivity.this);

        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.app_name));

        // set dialog message
        alertDialogBuilder
                .setMessage("Server is not responding please try again.")
                .setCancelable(false)
                .setPositiveButton("Retry", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        callEditProfileApi();
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        finish();
                    }
                });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();

    }


    public boolean isValidate() {
        if (editUserEmail.getText().toString().trim().length() == 0) {
            editUserEmail.setError(getString(R.string.valid_email_address));
            return false;
        } else if (editUserNumber.getText().toString().trim().length() == 0 || editUserNumber.getText().toString().trim().length() < 7) {
            editUserNumber.setError(getString(R.string.valid_mobile));
            return false;
        }
//        else if (!editUserPassword.getText().toString().trim().equalsIgnoreCase(editUserConfirmPassword.getText().toString().trim())) {
//            editUserConfirmPassword.setError(getString(R.string.valid_not_match));
//            return false;
//        }
        else if (spinnerCountry.getSelectedItemPosition() == 0) {
            showOkDialog(EditProfileActivity.this, getString(R.string.valid_country));
            return false;
        } else if (spinnerSyllabus.getSelectedItemPosition() == 0) {
            showOkDialog(EditProfileActivity.this, getString(R.string.valid_syllabus));
            return false;
        } else if (spinnerForms.getSelectedItemPosition() == 0 && mSyllabusList.get(spinnerSyllabus.getSelectedItemPosition()).isSubjectRequired().equals("1")) {
            showOkDialog(EditProfileActivity.this, getString(R.string.valid_form));
            return false;
        }

        return true;
    }


    private void callSubjectListApi() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");
        mSubjectsList.clear();
        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_SUBJECTS, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                try {
                    closeProgressDialog();
                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        JSONArray mJsonArray = mJsonObject.getJSONArray("Subjects");

                        for (int i = 0; i < mJsonArray.length(); i++) {

                            SubjectBean subjectBean = new SubjectBean();
                            subjectBean.setSubjectId(mJsonArray.getJSONObject(i).getString("subject_id"));
                            subjectBean.setDescription(mJsonArray.getJSONObject(i).getString("description"));
                            mSubjectsList.add(subjectBean);
                        }

                        SubjectBean subjectBean = new SubjectBean();
                        subjectBean.setSubjectId("0");
                        subjectBean.setDescription("Select Form/Level");

                        mSubjectsList.add(0, subjectBean);

                        setFormListAdapter();

                    } else {

                        showOkDialog(EditProfileActivity.this, mJsonObject.getString(MESSAGE));
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
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

    private void setFormListAdapter() {
        mSubjectID = mSubjectsList.get(0).getSubjectId();
        String[] arraySubject = new String[mSubjectsList.size()];
        int k = 0;
        for (SubjectBean subjectBean : mSubjectsList) {
            arraySubject[k++] = subjectBean.getDescription();
        }

        ArrayAdapter<String> formAdapter = new ArrayAdapter<String>(this,
                R.layout.item_show_spinner_1, arraySubject);
        formAdapter.setDropDownViewResource(R.layout.item_spinner_1);
        spinnerForms.setAdapter(formAdapter);

        spinnerForms.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                mSubjectID = mSubjectsList.get(position).getSubjectId();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        for (int i = 0; i < mSubjectsList.size(); i++) {
            if (mSubjectsList.get(i).getSubjectId().equalsIgnoreCase(managerWagona.getStringDetail(CLASS_ID))) {
                mSubjectID = mSubjectsList.get(i).getSubjectId();
                spinnerForms.setSelection(i);
            }
        }

    }

    private void setCountryListAdapter() {

        mCountryID = mCountryList.get(0).getCountryId();

        String[] arrayCountry = new String[mCountryList.size()];
        int k = 0;
        for (CountryBean countryBean : mCountryList) {
            arrayCountry[k++] = countryBean.getDescription();
        }

        ArrayAdapter<String> formAdapter = new ArrayAdapter<String>(this,
                R.layout.item_show_spinner_1, arrayCountry);

        formAdapter.setDropDownViewResource(R.layout.item_spinner_1);
        spinnerCountry.setAdapter(formAdapter);

        spinnerCountry.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                mCountryID = mCountryList.get(position).getCountryId();
                callSyllabusListApi();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        for (int j = 0; j < mCountryList.size(); j++) {
            if (mCountryList.get(j).getCountryId().equalsIgnoreCase(managerWagona.getStringDetail(COUNTRY_ID))) {
                mCountryID = mCountryList.get(j).getCountryId();
                spinnerCountry.setSelection(j);
                callSyllabusListApi();
                break;
            }
        }

    }

    private void setSyllabusListAdapter() {

        mSyllabusID = mSyllabusList.get(0).getSyllabusId();

        String[] arraySyllabus = new String[mSyllabusList.size()];
        int k = 0;
        for (SyllabusBean syllabusBean : mSyllabusList) {
            arraySyllabus[k++] = syllabusBean.getDescription();
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

        for (int j = 0; j < mSyllabusList.size(); j++) {
            if (mSyllabusList.get(j).getSyllabusId().equalsIgnoreCase(managerWagona.getStringDetail(SYLLABUS_ID))) {
                mSyllabusID = mSyllabusList.get(j).getSyllabusId();
                spinnerSyllabus.setSelection(j);
            }
        }
    }


/*
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent imageReturnedIntent) {

        //mPikImager.sendResultToLibrary(requestCode, resultCode, imageReturnedIntent);

        super.onActivityResult(requestCode, resultCode, imageReturnedIntent);

        EasyImage.handleActivityResult(requestCode, resultCode, imageReturnedIntent, this, new DefaultCallback() {
            @Override
            public void onImagePickerError(Exception e, EasyImage.ImageSource source, int type) {
                //Some error handling
            }

            @Override
            public void onImagePicked(File imageFile, EasyImage.ImageSource source, int type) {
                setImageToImageView(imageFile.toString());
            }

            @Override
            public void onCanceled(EasyImage.ImageSource source, int type) {
                //Cancel handling, you might wanna remove taken photo if it was canceled

            }
        });


    }*/

    private void callCountryListApi() {

        if (!preApiCallChecking()) return;
        showProgressDialog("Loading...");
        mCountryList.clear();

        StringRequest mStringRequest = new StringRequest(Request.Method.POST, getBaseUrl() + GET_COUNTRY, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //{"school_id":6,"success":"1","message":"You enquiry for school registration is sent successfully. your number is 6"}

                try {
                    closeProgressDialog();
                    JSONObject mJsonObject = new JSONObject(response);

                    if (mJsonObject.getInt(STATUS) == 1) {

                        JSONArray mJsonArray = mJsonObject.getJSONArray("Country");

                        for (int i = 0; i < mJsonArray.length(); i++) {
                            CountryBean countryBean = new CountryBean();
                            countryBean.setCountryId(mJsonArray.getJSONObject(i).getString("country_id"));
                            countryBean.setDescription(mJsonArray.getJSONObject(i).getString("description"));
                            mCountryList.add(countryBean);
                        }

                        CountryBean countryBean = new CountryBean();
                        countryBean.setCountryId("0");
                        countryBean.setDescription("Select Country");
                        mCountryList.add(0, countryBean);

                        setCountryListAdapter();

                    } else {
                        showOkDialog(EditProfileActivity.this, mJsonObject.getString(MESSAGE));
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }


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
                    closeProgressDialog();
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
                        showOkDialog(EditProfileActivity.this, mJsonObject.getString(MESSAGE));
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
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