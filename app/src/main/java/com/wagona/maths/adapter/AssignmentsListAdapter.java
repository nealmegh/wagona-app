package com.wagona.maths.adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
//import android.support.v4.content.ContextCompat;
import androidx.core.content.ContextCompat;

//import android.support.v7.widget.RecyclerView;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.wagona.maths.R;
import com.wagona.maths.offsetResponse.AssignmentsResponse;
import com.wagona.maths.offsetResponse.ListActions;
import com.wagona.maths.custom.ArcProgress;

import java.util.List;

/**
 * Created by mormukut on 2/5/2018.
 */

public class AssignmentsListAdapter extends RecyclerView.Adapter<AssignmentsListAdapter.MyHolder> {
    Context context;
    List<AssignmentsResponse> itemList;
    private LayoutInflater mInflater;
    private ListActions mListActions;

    public AssignmentsListAdapter(Context context, List<AssignmentsResponse> itemList, ListActions mListActions) {
        this.context = context;
        this.itemList = itemList;
        this.mListActions = mListActions;
        mInflater = (LayoutInflater) context.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public MyHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View layoutView = mInflater.inflate(R.layout.assigments_row, parent, false);
        return new MyHolder(layoutView);
    }

    @Override
    public void onBindViewHolder(MyHolder holder, @SuppressLint("RecyclerView") final int position) {
        holder.txtAssignmentName.setText(itemList.get(position).getName());
        holder.txtAssignmentDate.setText(itemList.get(position).getDate_end());
        holder.txtAssignmentName.setTextColor(ContextCompat.getColor(context, null == itemList.get(position).getScore_percent() ? R.color.arc_red : R.color.colorPrimaryDark));

        if (null == itemList.get(position).getScore_percent()) {
            holder.textPercentALA.setVisibility(View.GONE);
            holder.arc_progressALA.setVisibility(View.GONE);
        } else {

            holder.textPercentALA.setText(itemList.get(position).getScore_percent());
            holder.arc_progressALA.setProgress(Integer.parseInt(itemList.get(position).getScore_percent()));
            holder.arc_progressALA.setFinishedStrokeColor(getApropriateColor(itemList.get(position).getScore_percent()));
            holder.arc_progressALA.setUnfinishedStrokeColor(context.getResources().getColor(R.color.arc_gray));
            holder.arc_progressALA.setStrokeWidth(context.getResources().getDimension(R.dimen.dp_3));
        }

        holder.layoutAssignment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mListActions.onItemClick(itemList.get(position), position);
            }
        });
    }

    @Override
    public int getItemCount() {
        if (itemList == null)
            return 0;
        return this.itemList.size();
    }

    public class MyHolder extends RecyclerView.ViewHolder {
        private View view;
        private TextView txtAssignmentName;
        private TextView txtAssignmentDate;
        private TextView textPercentALA;
        private ArcProgress arc_progressALA;
        private RelativeLayout layoutAssignment;

        public MyHolder(View itemView) {
            super(itemView);
            view = itemView;
            txtAssignmentDate = (TextView) itemView.findViewById(R.id.txtAssignmentDate);
            txtAssignmentName = (TextView) itemView.findViewById(R.id.txtAssignmentName);
            textPercentALA = (TextView) itemView.findViewById(R.id.textPercentALA);
            arc_progressALA = (ArcProgress) itemView.findViewById(R.id.arc_progressALA);
            layoutAssignment = (RelativeLayout) itemView.findViewById(R.id.layoutAssignment);
        }
    }

    //get finishArc and percent lable color
    public int getApropriateColor(String score) {

        if (score.equalsIgnoreCase("--")) {
            return ContextCompat.getColor(context, R.color.dark_font);

        } else {
            if (Integer.parseInt(score) > 0 && Integer.parseInt(score) < 50) {

                return ContextCompat.getColor(context, R.color.arc_red);

            } else if (Integer.parseInt(score) >= 50 && Integer.parseInt(score) < 75) {

                return ContextCompat.getColor(context, R.color.arc_orange);

            } else if (Integer.parseInt(score) >= 75) {
                //green
                return ContextCompat.getColor(context, R.color.colorPrimaryDark);
            }

        }
        return ContextCompat.getColor(context, R.color.dark_font);
    }
}
