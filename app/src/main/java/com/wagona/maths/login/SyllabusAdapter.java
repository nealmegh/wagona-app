package com.wagona.maths.login;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.wagona.maths.R;
import com.wagona.maths.model.SyllabusBean;

import java.util.ArrayList;
import java.util.Locale;

/**
 * Created by sotsys-074 on 2/5/16.
 */
public class SyllabusAdapter extends BaseAdapter {

    private Context mContext;
    private ArrayList<SyllabusBean> mServices = new ArrayList<>();
    private ArrayList<SyllabusBean> mAllServices = new ArrayList<>();
    private boolean isSingleSelection = false;

    public SyllabusAdapter(Context context, ArrayList<SyllabusBean> services) {
        mContext = context;
        mAllServices = services;
    }


    @Override
    public int getCount() {
        return mServices.size();
    }


    @Override
    public SyllabusBean getItem(int position) {
        return mServices.get(position);
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }


    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        final ViewHolder viewHolder;

        if (convertView == null) {
            viewHolder = new ViewHolder();

            LayoutInflater mInflater = (LayoutInflater) mContext.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);

            convertView = mInflater.inflate(R.layout.row_syllabus, null);

            viewHolder.tvServiceName = (TextView) convertView.findViewById(R.id.tvServiceName);
            viewHolder.ivSelectService = (ImageView) convertView.findViewById(R.id.ivSelectService);

            convertView.setTag(viewHolder);

        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }

        final SyllabusBean innerService = mServices.get(position);

        if (innerService.isSelected()) {
            viewHolder.ivSelectService.setVisibility(View.VISIBLE);
            viewHolder.ivSelectService.setImageResource(R.drawable.radio_button_act);
        } else {
            viewHolder.ivSelectService.setVisibility(View.INVISIBLE);
        }

        viewHolder.tvServiceName.setText(innerService.getDescription());

        if (!isSingleSelection) {
            viewHolder.tvServiceName.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    innerService.setSelected(!innerService.isSelected());
                    notifyDataSetChanged();
                }
            });

            viewHolder.ivSelectService.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    innerService.setSelected(!innerService.isSelected());
                    notifyDataSetChanged();
                }
            });
        }


        return convertView;
    }

    public void setSingleSelection(boolean singleSelection) {
        isSingleSelection = singleSelection;
    }


    // Filter Class
    public void filter(String charText) {
        mServices.clear();
        if (charText == null || charText.length() == 0) {
            mServices.addAll(mAllServices);
        } else {
            for (SyllabusBean innerService : mAllServices) {
                if (innerService.getDescription().toLowerCase().contains(charText)) {
                    mServices.add(innerService);
                }
            }
        }
        notifyDataSetChanged();
    }

    private class ViewHolder {
        public TextView tvServiceName;
        public ImageView ivSelectService;

    }
}

