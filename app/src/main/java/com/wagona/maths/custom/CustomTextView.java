package com.wagona.maths.custom;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.widget.TextView;

import com.wagona.maths.R;

/**
 * Created by Amit on 23/2/16.
 */
public class CustomTextView extends TextView {

    public CustomTextView(Context context) {
        super(context);
    }

    public CustomTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
        setCustomFont(context, attrs);
    }

    public CustomTextView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        setCustomFont(context, attrs);
    }

    private void setCustomFont(Context ctx, AttributeSet attrs) {
        TypedArray a = ctx.obtainStyledAttributes(attrs, R.styleable.vFont);
        int customFont = a.getInt(R.styleable.vFont_typeface, 0);
        setCustomFont(ctx, customFont);
        a.recycle();
    }

    public boolean setCustomFont(Context context, int asset) {

        switch (asset) {
            case 0:

                setTypeface(Typeface.createFromAsset(context.getAssets(), "fonts/trebuc_0.ttf"));

                break;
            case 1:
                setTypeface(Typeface.createFromAsset(context.getAssets(), "fonts/trebucbd_0.ttf"));
                break;
            case 2:
                setTypeface(Typeface.createFromAsset(context.getAssets(), "fonts/trebucbi_0.ttf"));
                break;
            case 3:
                setTypeface(Typeface.createFromAsset(context.getAssets(), "fonts/trebucit_0.ttf"));
                break;

            default:
                break;
        }

        return true;
    }
}