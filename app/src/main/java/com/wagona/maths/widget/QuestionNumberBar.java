package com.wagona.maths.widget;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.wagona.maths.R;

/**
 * Created by sotsys-159 on 5/5/16.
 */
public class QuestionNumberBar extends LinearLayout {


    public QuestionNumberBar(Context context) {
        super(context);
        init(context);
    }

    public QuestionNumberBar(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public QuestionNumberBar(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    public TextView txtPageNumber[]=new TextView[10];


    public TextView txtQ1;
    public TextView txtQ2;
    public TextView txtQ3;
    public TextView txtQ4;
    public TextView txtQ5;
    public TextView txtQ6;
    public TextView txtQ7;
    public TextView txtQ8;
    public TextView txtQ9;
    public TextView txtQ10;


    private void init(Context context) {

        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View mView = inflater.inflate(R.layout.question_numbers, this);


        txtPageNumber[0]=(TextView)mView.findViewById(R.id.txtQ1);
        txtPageNumber[1]=(TextView)mView.findViewById(R.id.txtQ2);
        txtPageNumber[2]=(TextView)mView.findViewById(R.id.txtQ3);
        txtPageNumber[3]=(TextView)mView.findViewById(R.id.txtQ4);
        txtPageNumber[4]=(TextView)mView.findViewById(R.id.txtQ5);
        txtPageNumber[5]=(TextView)mView.findViewById(R.id.txtQ6);
        txtPageNumber[6]=(TextView)mView.findViewById(R.id.txtQ7);
        txtPageNumber[7]=(TextView)mView.findViewById(R.id.txtQ8);
        txtPageNumber[8]=(TextView)mView.findViewById(R.id.txtQ9);
        txtPageNumber[9]=(TextView)mView.findViewById(R.id.txtQ10);

        txtPageNumber[0].setOnClickListener(mListner);
        txtPageNumber[1].setOnClickListener(mListner);
        txtPageNumber[2].setOnClickListener(mListner);
        txtPageNumber[3].setOnClickListener(mListner);
        txtPageNumber[4].setOnClickListener(mListner);
        txtPageNumber[5].setOnClickListener(mListner);
        txtPageNumber[6].setOnClickListener(mListner);
        txtPageNumber[7].setOnClickListener(mListner);
        txtPageNumber[8].setOnClickListener(mListner);
        txtPageNumber[9].setOnClickListener(mListner);


    }

    OnClickListener mListner=new OnClickListener() {
        @Override
        public void onClick(View v) {

            switch (v.getId()){
                case R.id.txtQ1:
                    mOnNumberClickListner.onClickNumber(v,1);
                    break;
                case R.id.txtQ2:
                    mOnNumberClickListner.onClickNumber(v,2);
                    break;
                case R.id.txtQ3:
                    mOnNumberClickListner.onClickNumber(v,3);
                    break;
                case R.id.txtQ4:
                    mOnNumberClickListner.onClickNumber(v,4);
                    break;
                case R.id.txtQ5:
                    mOnNumberClickListner.onClickNumber(v,5);
                    break;
                case R.id.txtQ6:
                    mOnNumberClickListner.onClickNumber(v,6);
                    break;
                case R.id.txtQ7:
                    mOnNumberClickListner.onClickNumber(v,7);
                    break;
                case R.id.txtQ8:
                    mOnNumberClickListner.onClickNumber(v,8);
                    break;
                case R.id.txtQ9:
                    mOnNumberClickListner.onClickNumber(v,9);
                    break;
                case R.id.txtQ10:
                    mOnNumberClickListner.onClickNumber(v,10);
                    break;

            }

        }
    };

    OnNumberClickListner mOnNumberClickListner;

    public interface OnNumberClickListner{
        void onClickNumber(View mView, int position);
    }


    public void setOnNumberClickListner(OnNumberClickListner mOnNumberClickListner) {

        this.mOnNumberClickListner=mOnNumberClickListner;


    }
}
