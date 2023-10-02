package com.wagona.maths;

import android.app.Activity;
import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.KeyEvent;
import android.view.inputmethod.BaseInputConnection;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.webkit.WebView;

/**
 * Custom webview to handle key events.
 * Created by S.S. on 3/4/18.
 */

public class CustomWebView extends WebView {
    private KeyListener mKeyListener;
    private BaseInputConnection _inputConnection = null;
    private int _inputType = 0;
    private int _imeOptions = 5 | EditorInfo.IME_FLAG_NO_EXTRACT_UI;

    public CustomWebView(Context context) {
        super(context);
    }

    public CustomWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CustomWebView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setListener(final Activity activity, final KeyListener listener) {
        if (activity != null && !activity.isFinishing()) {
            setListener(listener);
        }
    }

    protected void setListener(final KeyListener listener) {
        this.mKeyListener = listener;
    }

    @Override
    public InputConnection onCreateInputConnection(EditorInfo outAttrs) {
        //        InputConnection inputConnection = super.onCreateInputConnection(outAttrs);
        //        outAttrs.imeOptions = outAttrs.imeOptions & ~EditorInfo.IME_FLAG_NAVIGATE_NEXT &
        //                ~EditorInfo.IME_FLAG_NAVIGATE_PREVIOUS;
        //        return inputConnection;
        return new BaseInputConnection(this, false); //this is needed for #dispatchKeyEvent() to be notified.
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        boolean dispatchFirst = super.dispatchKeyEvent(event);
        //         Listening here for whatever key events you need
        if (event.getAction() == KeyEvent.ACTION_UP)
            switch (event.getKeyCode()) {
                case KeyEvent.KEYCODE_ENTER:
                    Log.e("KeyEvent", "Go");
                    // e.g. get space and enter events here

                    mKeyListener.onSoftKeyClick();
                    break;
            }
        Log.e("KeyEvent", "Event");
        return dispatchFirst;
    }


    public interface KeyListener {
        void onSoftKeyClick();
    }
}
