package com.wagona.maths.dashboard;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.wagona.maths.R;
import com.wagona.maths.TestplayActivity;
import com.wagona.maths.history.TestHistoryActivity;

import java.util.Map;

/**
 * Created by sotsys-159 on 16/4/16.
 */
public class BRAGFragment extends BaseFragment {

    public BRAGFragment() {
        // Required empty public constructor
    }
    private String formName=null;

    private String subjectID = null;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        formName= getArguments().getString("FORM");
        subjectID = getArguments().getString(SUBJECT_ID);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_brag_colors, container, false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextView txtTestHistory=(TextView)view.findViewById(R.id.txtTestHistory);
        txtTestHistory.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent=new Intent(getActivity(),TestHistoryActivity.class);
                startActivity(intent);
            }
        });


        TextView textTakeTest=(TextView)view.findViewById(R.id.textTakeTest);
        textTakeTest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //Create Topic with "_" exmp: 556_566_581_583_592
                //please select at least 1 Topic to proceed

                String strTopicIds="";

                if(SelectTopicsFragment.mTopicsRecycleAdapter.getmMapValue().isEmpty()){
                    showOkDialog(getActivity(), "Please select at least 1 Topic to proceed");
                }else {


                    for (Map.Entry<Integer, String> entry :SelectTopicsFragment.mTopicsRecycleAdapter.getmMapValue().entrySet()) {
//                        Integer key = entry.getKey();
                        Object value = entry.getValue();
                        strTopicIds+=value+"_";
                    }
                    strTopicIds=strTopicIds.substring(0,strTopicIds.length()-1);

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


    }


}