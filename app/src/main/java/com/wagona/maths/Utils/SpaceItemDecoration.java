package com.wagona.maths.Utils;

import android.graphics.Rect;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

/**
 * Created by sotsys071 on 15/7/16.
 */
public class SpaceItemDecoration extends RecyclerView.ItemDecoration {

    private final int mVerticalSpaceHeight;
    private final int mHorizontalSpaceHeight;
    private final boolean isHorizontal;
    private final boolean isBoth;

    public SpaceItemDecoration(int mVerticalSpaceHeight) {
        this.isHorizontal = false;
        this.isBoth = false;
        this.mVerticalSpaceHeight = mVerticalSpaceHeight;
        this.mHorizontalSpaceHeight = 0;
    }

    public SpaceItemDecoration(int mHorizontalSpaceHeight, boolean isHorizontal) {
        this.isHorizontal = isHorizontal;
        this.isBoth = false;
        this.mVerticalSpaceHeight = 0;
        this.mHorizontalSpaceHeight = mHorizontalSpaceHeight;
    }

    public SpaceItemDecoration(int mVerticalSpaceHeight, int mHorizontalSpaceHeight, boolean isBoth) {
        this.isBoth = isBoth;
        this.isHorizontal = true;
        this.mVerticalSpaceHeight = mVerticalSpaceHeight;
        this.mHorizontalSpaceHeight = mHorizontalSpaceHeight;
    }

    @Override
    public void getItemOffsets(Rect outRect, View view, RecyclerView parent,
                               RecyclerView.State state) {
        if (!isBoth) {
            if (isHorizontal) {
                outRect.right = mHorizontalSpaceHeight;
            } else {
                outRect.bottom = mVerticalSpaceHeight;
            }
        }else
        {
            outRect.right = mHorizontalSpaceHeight;
            outRect.bottom = mVerticalSpaceHeight;
        }
    }
}
