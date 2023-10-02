package com.wagona.maths.model;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by sotsys-217 on 10/7/17.
 */

public class SyllabusBean implements Parcelable {

    private String syllabus_id;
    private String description;
    private boolean isSelected;
    private String subject_required;

    public String getSyllabusId() {
        return syllabus_id;
    }

    public String getDescription() {
        return description;
    }

    public boolean isSelected() {
        return isSelected;
    }

    public void setSyllabusId(String syllabus_id) {
        this.syllabus_id = syllabus_id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setSelected(boolean selected) {
        isSelected = selected;
    }

    public SyllabusBean() {
    }

    public String isSubjectRequired() {
        return subject_required;
    }

    public void setSubjectRequired(String subject_required) {
        this.subject_required = subject_required;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.syllabus_id);
        dest.writeString(this.description);
        dest.writeByte(this.isSelected ? (byte) 1 : (byte) 0);
        dest.writeString(this.subject_required);
    }

    protected SyllabusBean(Parcel in) {
        this.syllabus_id = in.readString();
        this.description = in.readString();
        this.isSelected = in.readByte() != 0;
        this.subject_required = in.readString();
    }

    public static final Creator<SyllabusBean> CREATOR = new Creator<SyllabusBean>() {
        @Override
        public SyllabusBean createFromParcel(Parcel source) {
            return new SyllabusBean(source);
        }

        @Override
        public SyllabusBean[] newArray(int size) {
            return new SyllabusBean[size];
        }
    };
}
