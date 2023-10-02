package com.wagona.maths.dashboard.adapter;

/**
 * Created by Amit on 15/3/16.
 */

import static com.wagona.maths.Utils.AppParameter.PAYMENT_STATUS;

import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.recyclerview.widget.RecyclerView;

import com.wagona.maths.HomeActivity;
import com.wagona.maths.R;
import com.wagona.maths.Utils.SessionManagerWagona;
import com.wagona.maths.model.TopicDetailsBean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Recycle view adapter for Place items (listing of places)
 */


public class TopicsRecycleAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {


    private Context context = null;

    //List<TopicDetailsBean> mTopicDetailsBeans = new ArrayList<>();

    List<TopicDetailsBean> mTopicDetailsBeans = new ArrayList<>((Arrays.asList(new TopicDetailsBean[7])));


    Map<Integer, String> mMapValue = new HashMap<>();

    public Map<Integer, String> getmMapValue() {
        return mMapValue;
    }

    int MAX_SELECTION = 0;

    private SessionManagerWagona managerWagona;


    public TopicsRecycleAdapter(Context context) {

        this.context = context;
        managerWagona = new SessionManagerWagona(context);


    }


    @Override
    public int getItemViewType(int position) {
        return 0;
    }

    @Override
    public int getItemCount() {
        return mTopicDetailsBeans.size();
    }


    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_topic_1, parent, false);
        CustomViewHolder viewHolder = new CustomViewHolder(view);

        return viewHolder;

    }

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

    @Override
    public void onBindViewHolder(final RecyclerView.ViewHolder holder, final int position) {

        if (holder instanceof CustomViewHolder) {

            final CustomViewHolder itemViewHolder = (CustomViewHolder) holder;

            itemViewHolder.checkBoxTopics.setChecked(mTopicDetailsBeans.get(position).isChecked());
            itemViewHolder.checkBoxTopics.setText(mTopicDetailsBeans.get(position).getDescription());
            itemViewHolder.txtQuestions.setText(mTopicDetailsBeans.get(position).getNum_questions());
            itemViewHolder.txtCurrect.setText(mTopicDetailsBeans.get(position).getNum_correct());
            itemViewHolder.txtWrong.setText(mTopicDetailsBeans.get(position).getNum_wrong());

            if (mTopicDetailsBeans.get(position).getPercentage().equalsIgnoreCase("-")) {
                itemViewHolder.txtPercentQ.setText(mTopicDetailsBeans.get(position).getPercentage());
            } else {
                itemViewHolder.txtPercentQ.setText(mTopicDetailsBeans.get(position).getPercentage() + "%");
            }


            itemViewHolder.checkBoxTopics.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    boolean isChecked = itemViewHolder.checkBoxTopics.isChecked();
                    if (isChecked) {
                        MAX_SELECTION++;
                        mMapValue.put(position, mTopicDetailsBeans.get(position).getTopic_id());
                    } else if (!isChecked) {
                        mMapValue.remove(position);
                        MAX_SELECTION--;
                    }
                    if (MAX_SELECTION > 5) {
                        //show Dialog for no more selection
                        mMapValue.remove(position);
                        MAX_SELECTION--;
                        showOkDialog(context, "You have selected maximum numbers of topics (5). Start Test now or select different topics.");
                        itemViewHolder.checkBoxTopics.setChecked(false);

                    } else {
                        mTopicDetailsBeans.get(position).setChecked(isChecked);

                    }

                }
            });

            if (mTopicDetailsBeans.get(position).getPercentage().equalsIgnoreCase("-")) {

                itemViewHolder.checkBoxTopics.setTextColor(context.getResources().getColor(R.color.dark_font));
                itemViewHolder.txtQuestions.setTextColor(context.getResources().getColor(R.color.dark_font));
                itemViewHolder.txtCurrect.setTextColor(context.getResources().getColor(R.color.dark_font));
                itemViewHolder.txtWrong.setTextColor(context.getResources().getColor(R.color.dark_font));
                itemViewHolder.txtPercentQ.setTextColor(context.getResources().getColor(R.color.dark_font));


            } else if (Integer.parseInt(mTopicDetailsBeans.get(position).getPercentage()) > 50 && Integer.parseInt(mTopicDetailsBeans.get(position).getPercentage()) < 75) {


                itemViewHolder.checkBoxTopics.setTextColor(context.getResources().getColor(R.color.arc_orange));
                itemViewHolder.txtQuestions.setTextColor(context.getResources().getColor(R.color.arc_orange));
                itemViewHolder.txtCurrect.setTextColor(context.getResources().getColor(R.color.arc_orange));
                itemViewHolder.txtWrong.setTextColor(context.getResources().getColor(R.color.arc_orange));
                itemViewHolder.txtPercentQ.setTextColor(context.getResources().getColor(R.color.arc_orange));

            } else if (Integer.parseInt(mTopicDetailsBeans.get(position).getPercentage()) >= 75) {

                itemViewHolder.checkBoxTopics.setTextColor(context.getResources().getColor(R.color.colorPrimaryDark));
                itemViewHolder.txtQuestions.setTextColor(context.getResources().getColor(R.color.colorPrimaryDark));
                itemViewHolder.txtCurrect.setTextColor(context.getResources().getColor(R.color.colorPrimaryDark));
                itemViewHolder.txtWrong.setTextColor(context.getResources().getColor(R.color.colorPrimaryDark));
                itemViewHolder.txtPercentQ.setTextColor(context.getResources().getColor(R.color.colorPrimaryDark));
            } else {

                itemViewHolder.checkBoxTopics.setTextColor(context.getResources().getColor(R.color.arc_red));
                itemViewHolder.txtQuestions.setTextColor(context.getResources().getColor(R.color.arc_red));
                itemViewHolder.txtCurrect.setTextColor(context.getResources().getColor(R.color.arc_red));
                itemViewHolder.txtWrong.setTextColor(context.getResources().getColor(R.color.arc_red));
                itemViewHolder.txtPercentQ.setTextColor(context.getResources().getColor(R.color.arc_red));

            }


            if (HomeActivity.dialogMessage.trim().equals("Your subscription has expired, to continue accessing all content please upgrade your account.")
                    || HomeActivity.dialogMessage.trim().equals("Your free trial has expired, to continue accessing all content please upgrade your account.")
                    || HomeActivity.dialogMessage.trim().equals("To continue accessing all content please contact your School Administrator")) {
                if (mTopicDetailsBeans.get(position).getIs_paid() == 1
                        && managerWagona.getStringDetail(PAYMENT_STATUS).equalsIgnoreCase("NOT-COMPLETE")
                        ) {
                    //premium
                    itemViewHolder.checkBoxTopics.setEnabled(false);

                } else {
                    //free
                    itemViewHolder.checkBoxTopics.setEnabled(true);
                }
            } else {
                if (mTopicDetailsBeans.get(position).getIs_paid() == 1
                        && managerWagona.getStringDetail(PAYMENT_STATUS).equalsIgnoreCase("NOT-COMPLETE")
                        ) {
                    //premium
                    itemViewHolder.checkBoxTopics.setEnabled(true);

                } else {
                    //free
                    itemViewHolder.checkBoxTopics.setEnabled(true);
                }
            }


        }

    }

    public void setArrayListData(List<TopicDetailsBean> arrayListData) {

        this.mTopicDetailsBeans = arrayListData;
        notifyDataSetChanged();

    }

    public void setRandomSelection() {

        int targetValue = 5 - MAX_SELECTION;

        Log.e("TAG", "targetValue:" + targetValue);

        ArrayList<Integer> mIntegers = new ArrayList<>();
        int min = 0;
        int max = mTopicDetailsBeans.size() - 1;
        Random r = new Random();
        while (mIntegers.size() != targetValue) {
            int i1 = r.nextInt(max - min + 1) + min;
            if (!mMapValue.containsKey(i1) && !mIntegers.contains(i1) && doiAddTopic(i1)) {
                mIntegers.add(i1);
            }
        }

        if (!mIntegers.isEmpty()) {
            for (int i = 0; i < mIntegers.size(); i++) {
                mTopicDetailsBeans.get(mIntegers.get(i)).setChecked(true);
                MAX_SELECTION++;
                mMapValue.put(mIntegers.get(i), mTopicDetailsBeans.get(mIntegers.get(i)).getTopic_id());
            }
        }

        notifyDataSetChanged();

    }

    private boolean doiAddTopic(int position) {

        if (mTopicDetailsBeans.get(position).getIs_paid() == 1
                && managerWagona.getStringDetail(PAYMENT_STATUS).equalsIgnoreCase("NOT-COMPLETE")
                ) {
            return false;
        } else {
            return true;
        }


    }

    public class CustomViewHolder extends RecyclerView.ViewHolder {


        private CheckBox checkBoxTopics;
        private TextView txtQuestions;
        private TextView txtCurrect;
        private TextView txtWrong;
        private TextView txtPercentQ;

        public CustomViewHolder(View view) {
            super(view);

            this.checkBoxTopics = (CheckBox) view.findViewById(R.id.checkBoxTopics);
            this.txtQuestions = (TextView) view.findViewById(R.id.txtQuestions);
            this.txtCurrect = (TextView) view.findViewById(R.id.txtCurrect);
            this.txtWrong = (TextView) view.findViewById(R.id.txtWrong);
            this.txtPercentQ = (TextView) view.findViewById(R.id.txtPercentQ);

            /*this.checkBoxTopics.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {

                }
            });*/


        }
    }


}


