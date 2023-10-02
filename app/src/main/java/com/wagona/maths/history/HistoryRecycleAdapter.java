package com.wagona.maths.history;

/**
 * Created by Amit on 15/3/16.
 */

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.wagona.maths.R;
import com.wagona.maths.custom.ArcProgress;
import com.wagona.maths.model.TestHistoryBean;

import java.util.ArrayList;
import java.util.List;

/**
 * Recycle view adapter for Place items (listing of places)
 */


public class HistoryRecycleAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private final int VIEW_TYPE_ITEM = 0;
    private final int VIEW_TYPE_LOADING = 1;

    private Context context=null;


    List<TestHistoryBean> mTestHistoryBeans=new ArrayList<>();

    public HistoryRecycleAdapter(Context context){

        this.context=context;

    }

    public void setOnItemClickListner(OnItemClickListner mOnItemClickListner){
        this.mOnItemClickListner=mOnItemClickListner;

    }

    OnItemClickListner mOnItemClickListner=null;

    interface OnItemClickListner{
        public void onItemClickListner(String testID);

    }

    //**
    // Added for Seachview with recycle view
    // *

    public TestHistoryBean removeItem(int position) {
        final TestHistoryBean model = mTestHistoryBeans.remove(position);
        notifyItemRemoved(position);
        return model;
    }

    public void addItem(int position, TestHistoryBean model) {
        mTestHistoryBeans.add(position, model);
        notifyItemInserted(position);
    }

    public void moveItem(int fromPosition, int toPosition) {
        final TestHistoryBean model = mTestHistoryBeans.remove(fromPosition);
        mTestHistoryBeans.add(toPosition, model);
        notifyItemMoved(fromPosition, toPosition);
    }

    public void animateTo(List<TestHistoryBean> models) {
        applyAndAnimateRemovals(models);
        applyAndAnimateAdditions(models);
        applyAndAnimateMovedItems(models);
    }
    private void applyAndAnimateRemovals(List<TestHistoryBean> newModels) {
        for (int i = mTestHistoryBeans.size() - 1; i >= 0; i--) {
            final TestHistoryBean model = mTestHistoryBeans.get(i);
            if (!newModels.contains(model)) {
                removeItem(i);
            }
        }
    }
    private void applyAndAnimateAdditions(List<TestHistoryBean> newModels) {
        for (int i = 0, count = newModels.size(); i < count; i++) {
            final TestHistoryBean model = newModels.get(i);
            if (!mTestHistoryBeans.contains(model)) {
                addItem(i, model);
            }
        }
    }

    private void applyAndAnimateMovedItems(List<TestHistoryBean> newModels) {
        for (int toPosition = newModels.size() - 1; toPosition >= 0; toPosition--) {
            final TestHistoryBean model = newModels.get(toPosition);
            final int fromPosition = mTestHistoryBeans.indexOf(model);
            if (fromPosition >= 0 && fromPosition != toPosition) {
                moveItem(fromPosition, toPosition);
            }
        }
    }

    public void setFilter(List<TestHistoryBean> countryModels) {
        mTestHistoryBeans = new ArrayList<>();
        mTestHistoryBeans.addAll(countryModels);
        notifyDataSetChanged();
    }




    @Override
    public int getItemViewType(int position) {
        return 0;
    }
    @Override
    public int getItemCount() {
        return mTestHistoryBeans.size();
    }


    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_history_1, parent, false);
            CustomViewHolder viewHolder = new CustomViewHolder(view);

            return viewHolder;

    }


    @Override
    public void onBindViewHolder(final RecyclerView.ViewHolder holder, @SuppressLint("RecyclerView") final int position) {

        if(holder instanceof CustomViewHolder){

            final CustomViewHolder itemViewHolder = (CustomViewHolder) holder;

            itemViewHolder.txtTestName.setText(mTestHistoryBeans.get(position).getSubject_description());
            itemViewHolder.txtTestDate.setText(mTestHistoryBeans.get(position).getDate_updated());
            itemViewHolder.textTopicsNum.setText(mTestHistoryBeans.get(position).getNum_topics()+"");
            itemViewHolder.textQuestionNum.setText(mTestHistoryBeans.get(position).getNum_questions()+"");
            itemViewHolder.textCurrectNum.setText(mTestHistoryBeans.get(position).getNum_correct()+"");

            /**
             * Calculation for Progress here
             * */

            //int currentProgress=(mTestHistoryBeans.get(position).getNum_correct()/mTestHistoryBeans.get(position).getNum_questions())*100;

           // Log.e("TAG","currentProgress: "+currentProgress);

            itemViewHolder.textPercent.setText(mTestHistoryBeans.get(position).getScore_percent()+"%");

            if(mTestHistoryBeans.get(position).getScore_percent()==0){


                itemViewHolder.scoreProgress.setFinishedStrokeColor(context.getResources().getColor(R.color.arc_gray));
                itemViewHolder.textPercent.setTextColor(context.getResources().getColor(R.color.dark_font));
                itemViewHolder.textLable.setTextColor(context.getResources().getColor(R.color.dark_font));

            }else if(mTestHistoryBeans.get(position).getScore_percent()>=50 && mTestHistoryBeans.get(position).getScore_percent()<75){


                itemViewHolder.scoreProgress.setFinishedStrokeColor(context.getResources().getColor(R.color.arc_orange));
                itemViewHolder.textPercent.setTextColor(context.getResources().getColor(R.color.arc_orange));
                itemViewHolder.textLable.setTextColor(context.getResources().getColor(R.color.arc_orange));

            }else  if(mTestHistoryBeans.get(position).getScore_percent()>=75){

                itemViewHolder.scoreProgress.setFinishedStrokeColor(context.getResources().getColor(R.color.colorPrimaryDark));
                itemViewHolder.textPercent.setTextColor(context.getResources().getColor(R.color.colorPrimaryDark));
                itemViewHolder.textLable.setTextColor(context.getResources().getColor(R.color.colorPrimaryDark));

            }else{

                itemViewHolder.scoreProgress.setFinishedStrokeColor(context.getResources().getColor(R.color.arc_red));
                itemViewHolder.textPercent.setTextColor(context.getResources().getColor(R.color.arc_red));
                itemViewHolder.textLable.setTextColor(context.getResources().getColor(R.color.arc_red));

            }
            itemViewHolder.scoreProgress.setProgress(mTestHistoryBeans.get(position).getScore_percent());

            itemViewHolder.itemLayout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    mOnItemClickListner.onItemClickListner(mTestHistoryBeans.get(position).getTest_id());
                }
            });
        }

    }

    @SuppressLint("NotifyDataSetChanged")
    public void setArrayListData(List<TestHistoryBean> mTestHistoryBeans) {

        this.mTestHistoryBeans=mTestHistoryBeans;
        notifyDataSetChanged();


    }

    public class CustomViewHolder extends RecyclerView.ViewHolder {


        private TextView txtTestName;
        private TextView txtTestDate;
        private TextView textTopicsNum;
        private TextView textQuestionNum;
        private TextView textCurrectNum;

        private TextView textLable;
        private TextView textPercent;
        private RelativeLayout itemLayout;




        private ArcProgress scoreProgress;

        public CustomViewHolder(View view) {
            super(view);

            this.txtTestName = (TextView) view.findViewById(R.id.txtTestName);
            this.txtTestDate = (TextView) view.findViewById(R.id.txtTestDate);
            this.textTopicsNum = (TextView) view.findViewById(R.id.textTopicsNum);
            this.textQuestionNum = (TextView) view.findViewById(R.id.textQuestionNum);
            this.textCurrectNum = (TextView) view.findViewById(R.id.textCurrectNum);
            this.scoreProgress = (ArcProgress) view.findViewById(R.id.scoreProgress);

            this.textLable = (TextView) view.findViewById(R.id.textLable);
            this.textPercent = (TextView) view.findViewById(R.id.textPercent);

            this.itemLayout=(RelativeLayout)view.findViewById(R.id.itemLayout);

        }
    }




}


