package com.wagona.maths.model;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by sotsys-217 on 19/8/17.
 */

public class SubjectBean implements Parcelable {

    private String subject_id;
    private String description;

    public String getSubjectId() {
        return subject_id;
    }

    public void setSubjectId(String subject_id) {
        this.subject_id = subject_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.subject_id);
        dest.writeString(this.description);
    }

    public SubjectBean() {
    }

    protected SubjectBean(Parcel in) {
        this.subject_id = in.readString();
        this.description = in.readString();
    }

    public static final Creator<SubjectBean> CREATOR = new Creator<SubjectBean>() {
        @Override
        public SubjectBean createFromParcel(Parcel source) {
            return new SubjectBean(source);
        }

        @Override
        public SubjectBean[] newArray(int size) {
            return new SubjectBean[size];
        }
    };
}
