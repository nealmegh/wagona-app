package com.wagona.maths.offsetResponse;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by mormukut on 2/5/2018.
 */

public class AssignmentsResponse {

    @Expose
    @SerializedName("class_name")
    private String class_name;
    @Expose
    @SerializedName("date_taken")
    private String date_taken;
    @Expose
    @SerializedName("header_status")
    private String header_status;
    @Expose
    @SerializedName("score_percent")
    private String score_percent;
    @Expose
    @SerializedName("test_number")
    private String test_number;
    @Expose
    @SerializedName("score")
    private String score;
    @Expose
    @SerializedName("id")
    private String id;
    @Expose
    @SerializedName("date_end")
    private String date_end;
    @Expose
    @SerializedName("date_start")
    private String date_start;
    @Expose
    @SerializedName("topic_ids")
    private String topic_ids;
    @Expose
    @SerializedName("name")
    private String name;
    @Expose
    @SerializedName("assignment_id")
    private String assignment_id;

    public String getClass_name() {
        return class_name;
    }

    public void setClass_name(String class_name) {
        this.class_name = class_name;
    }

    public String getDate_taken() {
        return date_taken;
    }

    public void setDate_taken(String date_taken) {
        this.date_taken = date_taken;
    }

    public String getHeader_status() {
        return header_status;
    }

    public void setHeader_status(String header_status) {
        this.header_status = header_status;
    }

    public String getScore_percent() {
        return score_percent;
    }

    public void setScore_percent(String score_percent) {
        this.score_percent = score_percent;
    }

    public String getTest_number() {
        return test_number;
    }

    public void setTest_number(String test_number) {
        this.test_number = test_number;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDate_end() {
        return date_end;
    }

    public void setDate_end(String date_end) {
        this.date_end = date_end;
    }

    public String getDate_start() {
        return date_start;
    }

    public void setDate_start(String date_start) {
        this.date_start = date_start;
    }

    public String getTopic_ids() {
        return topic_ids;
    }

    public void setTopic_ids(String topic_ids) {
        this.topic_ids = topic_ids;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAssignment_id() {
        return assignment_id;
    }

    public void setAssignment_id(String assignment_id) {
        this.assignment_id = assignment_id;
    }
}
