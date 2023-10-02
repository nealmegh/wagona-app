package com.wagona.maths.model;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by sotsys-217 on 19/8/17.
 */

public class CountryBean implements Parcelable {

    private String country_id;
    private String description;

    public String getCountryId() {
        return country_id;
    }

    public void setCountryId(String country_id) {
        this.country_id = country_id;
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
        dest.writeString(this.country_id);
        dest.writeString(this.description);
    }

    public CountryBean() {
    }

    protected CountryBean(Parcel in) {
        this.country_id = in.readString();
        this.description = in.readString();
    }

    public static final Parcelable.Creator<CountryBean> CREATOR = new Parcelable.Creator<CountryBean>() {
        @Override
        public CountryBean createFromParcel(Parcel source) {
            return new CountryBean(source);
        }

        @Override
        public CountryBean[] newArray(int size) {
            return new CountryBean[size];
        }
    };
}
