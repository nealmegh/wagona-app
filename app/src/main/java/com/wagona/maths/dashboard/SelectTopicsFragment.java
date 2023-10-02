package com.wagona.maths.dashboard;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.core.view.ViewCompat;
import androidx.core.widget.NestedScrollView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.wagona.maths.R;
import com.wagona.maths.TestplayActivity;
import com.wagona.maths.dashboard.adapter.TopicsRecycleAdapter;
import com.wagona.maths.history.TestHistoryActivity;
import com.wagona.maths.model.TopicDetailsBean;
import com.wagona.maths.model.TopicListBean;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by sotsys-159 on 16/4/16.
 */
public class SelectTopicsFragment extends BaseFragment {

    public SelectTopicsFragment() {
        // Required empty public constructor
    }

    String subjectID = null;

    String formName=null;

    List<TopicDetailsBean> mTopicDetailsBeans = new ArrayList<>();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        subjectID = getArguments().getString(SUBJECT_ID);

        formName= getArguments().getString("FORM");


        TopicListBean mTopicListBean = (TopicListBean) getArguments().getSerializable("ArrayObject");

        mTopicDetailsBeans = mTopicListBean.getmTopicDetailsBeans();

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_select_topics, container, false);
    }

    private NestedScrollView scrollViewTopics;
    private TextView txtSelectRandom;
    private TextView textTakeTest;


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        scrollViewTopics = (NestedScrollView) view.findViewById(R.id.scrollViewTopics);
        //scrollViewTopics.setVisibility(View.GONE);
        scrollViewTopics.setVisibility(View.VISIBLE);


        linearLayoutManager = new LinearLayoutManager(getActivity());
        linearLayoutManager.setAutoMeasureEnabled(true);

        recycleTopics = (RecyclerView) view.findViewById(R.id.recycleTopics);
        recycleTopics.setLayoutManager(linearLayoutManager);


        ViewCompat.setNestedScrollingEnabled(recycleTopics, false);


        mTopicsRecycleAdapter = new TopicsRecycleAdapter(getActivity());
        recycleTopics.setAdapter(mTopicsRecycleAdapter);

        TextView txtTestHistory = (TextView) view.findViewById(R.id.txtTestHistory);
        txtTestHistory.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), TestHistoryActivity.class);
                startActivity(intent);
            }
        });

        txtSelectRandom = (TextView) view.findViewById(R.id.txtSelectRandom);
        txtSelectRandom.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Check for Array is Emplty or not
                mTopicsRecycleAdapter.setRandomSelection();
            }
        });

        textTakeTest = (TextView) view.findViewById(R.id.textTakeTest);
        textTakeTest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //Create Topic with "_" exmp: 556_566_581_583_592
                //please select at least 1 Topic to proceed

                String strTopicIds = "";

                if (mTopicsRecycleAdapter.getmMapValue().isEmpty()) {
                    showOkDialog(getActivity(), "Please select at least 1 Topic to proceed");
                } else {


                    for (Map.Entry<Integer, String> entry : mTopicsRecycleAdapter.getmMapValue().entrySet()) {
                        Integer key = entry.getKey();
                        Object value = entry.getValue();
                        strTopicIds += value + "_";
                    }
                    strTopicIds = strTopicIds.substring(0, strTopicIds.length() - 1);

                    //call test api to get Test data

                    Intent intent=new Intent(getActivity(), TestplayActivity.class);
                    intent.putExtra("TOPIC_LIST",strTopicIds);
                    intent.putExtra("FORM",formName);
                    intent.putExtra(SUBJECT_ID,subjectID);
                    startActivity(intent);
                    getActivity().finish();
                }

            }
        });


        mTopicsRecycleAdapter.setArrayListData(mTopicDetailsBeans);


        //callTopicListApi();


    }


    LinearLayoutManager linearLayoutManager = null;
    RecyclerView recycleTopics;

    public static TopicsRecycleAdapter mTopicsRecycleAdapter = null;


}