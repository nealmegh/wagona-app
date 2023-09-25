package com.wagona.maths.login;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.wagona.maths.R;
import com.wagona.maths.model.SyllabusBean;

import java.util.ArrayList;

public class SearchSyllabusActivity extends AppCompatActivity {

    private Toolbar toolbar;

    protected ListView lvService;
    private ArrayList<SyllabusBean> mSyllabusList = new ArrayList<>();
    private SyllabusAdapter mServiceAdapter;

    private TextView textBtnSubmit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_syllabus);

        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            ArrayList<SyllabusBean> mData = extras.getParcelableArrayList("data");
            mSyllabusList.addAll(mData);
        }
        initControls();
    }

    void initControls() {
        setScreenToolbar();

        lvService = (ListView) findViewById(R.id.lvSyllabus);
        mServiceAdapter = new SyllabusAdapter(this, mSyllabusList);
        mServiceAdapter.setSingleSelection(false);
        lvService.setAdapter(mServiceAdapter);

        mServiceAdapter.filter("");

        textBtnSubmit = (TextView) findViewById(R.id.textBtnSubmit);
        textBtnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent iResult = new Intent();
                iResult.putExtra("data", mSyllabusList);
                setResult(RESULT_OK, iResult);
                finish();
            }
        });
    }

    private void setScreenToolbar() {
        toolbar = (Toolbar) findViewById(R.id.headerStrip);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        TextView textHeader = (TextView) toolbar.findViewById(R.id.textHeader);
        textHeader.setText("Select Syllabus");


        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

}
