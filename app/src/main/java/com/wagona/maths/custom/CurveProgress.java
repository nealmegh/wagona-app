package com.wagona.maths.custom;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.wagona.maths.R;
import com.wagona.maths.Utils.Utils;

import org.w3c.dom.Text;

/**
 * Created by sotsys-159 on 19/4/16.
 */
public class CurveProgress extends RelativeLayout {


    int progress = 0;

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
        arc_progress.setProgress(progress);
        this.invalidate();
    }

    public CurveProgress(Context context) {
        this(context, null);
    }

    public CurveProgress(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public CurveProgress(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    ArcProgress arc_progress;

    private void init(Context context, AttributeSet attrs) {

        final TypedArray attr = context.obtainStyledAttributes(attrs, R.styleable.CurveProgress, 0, 0);

        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View mView = inflater.inflate(R.layout.curve_process, this);


        arc_progress = (ArcProgress) mView.findViewById(R.id.arcP);
        final TextView textLable = (TextView) mView.findViewById(R.id.textLable);
        final TextView textPercent = (TextView) mView.findViewById(R.id.textPercent);


        textPercent.setTextColor(attr.getColor(R.styleable.CurveProgress_text_color, Color.RED));
        textLable.setTextColor(attr.getColor(R.styleable.CurveProgress_text_color, Color.RED));

        if (attr.getBoolean(R.styleable.CurveProgress_top_text_visibility, true)) {
            textLable.setVisibility(VISIBLE);
        } else {
            textLable.setVisibility(GONE);
        }

        textPercent.setText(attr.getString(R.styleable.CurveProgress_text_percentage));
        textLable.setText(attr.getString(R.styleable.CurveProgress_text_lable));


        textLable.setTextSize(attr.getInt(R.styleable.CurveProgress_text_lable_size, 10));
        textPercent.setTextSize(attr.getInt(R.styleable.CurveProgress_text_percentage_size, 14));
        setProgress(attr.getInt(R.styleable.CurveProgress_curv_progress, 0));

        float width=attr.getDimension(R.styleable.CurveProgress_curv_stroke_width, Utils.dp2px(getResources(), 4));
        int fColor=attr.getColor(R.styleable.CurveProgress_curv_finished_color, Color.RED);
        int ufColor=attr.getColor(R.styleable.CurveProgress_curv_unfinished_color, Color.GRAY);
        int max=attr.getInt(R.styleable.CurveProgress_curv_max, 100);

        arc_progress.setData(width,fColor,ufColor,max);

        //arc_progress.setStrokeWidth(attr.getDimension(R.styleable.CurveProgress_curv_stroke_width, Utils.dp2px(getResources(), 4)));
        //arc_progress.setFinishedStrokeColor(attr.getColor(R.styleable.CurveProgress_curv_finished_color, Color.RED));
        //arc_progress.setUnfinishedStrokeColor(attr.getColor(R.styleable.CurveProgress_curv_unfinished_color, Color.GRAY));
        //arc_progress.setMax(attr.getInt(R.styleable.CurveProgress_curv_max, 100));


    }


}
