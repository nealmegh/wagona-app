package com.wagona.maths;

import android.app.Activity;
import android.content.Context;
//import android.support.v7.widget.RecyclerView;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.wagona.maths.model.PaymentTypeBean;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by sotsys-159 on 17/10/17.
 */

public class PaymentTypeAdapter extends RecyclerView.Adapter<PaymentTypeAdapter.RecyclerViewHolders> {
    private List<PaymentTypeBean> itemList;
    private Context context;
    private ListActions listActions;
    private LayoutInflater mInflater;

//    @Override
//    public void notifyDataSetChanged() {
//
//    }

    public interface ListActions {
        void onItemClick(PaymentTypeBean item, int position, View view);
    }

    public PaymentTypeAdapter(Context context) {
        this.context = context;
        mInflater = (LayoutInflater) context.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
    }

    public void setListItemClick(ListActions mListActions) {
        listActions = mListActions;
    }

    @Override
    public RecyclerViewHolders onCreateViewHolder(ViewGroup parent, int viewType) {
        View layoutView = mInflater.inflate(R.layout.item_pay_types, parent, false);
        RecyclerViewHolders rcv = new RecyclerViewHolders(layoutView);
        return rcv;
    }

    @Override
    public void onBindViewHolder(RecyclerViewHolders holder, final int position) {
        final PaymentTypeBean mPaymentBean = itemList.get(position);

        holder.txtPrice.setText("$" + mPaymentBean.getPrice());
        holder.txtTitle.setText(mPaymentBean.getDescription());

        holder.layoutMain.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                listActions.onItemClick(mPaymentBean, position, view);
            }
        });
    }

    @Override
    public int getItemCount() {
        if (itemList == null)
            return 0;
        return this.itemList.size();
    }

    public List<PaymentTypeBean> getItemList() {
        return itemList;
    }

    public void setItemList(List<PaymentTypeBean> itemList) {
        this.itemList = itemList;
    }

    public class RecyclerViewHolders extends RecyclerView.ViewHolder {
        private View view;
        private TextView txtTitle;
        private TextView txtPrice;
        private LinearLayout layoutMain;

        public RecyclerViewHolders(View itemView) {
            super(itemView);
            view = itemView;

            txtPrice = (TextView) view.findViewById(R.id.txtPrice);
            txtTitle = (TextView) view.findViewById(R.id.txtTitle);
            layoutMain = (LinearLayout) view.findViewById(R.id.layoutMain);
        }
    }
}
