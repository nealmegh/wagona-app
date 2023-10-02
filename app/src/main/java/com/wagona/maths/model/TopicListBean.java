package com.wagona.maths.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by sotsys-159 on 3/5/16.
 */
public class TopicListBean implements Serializable {

    List<TopicDetailsBean> mTopicDetailsBeans = new ArrayList<>();


    public List<TopicDetailsBean> getmTopicDetailsBeans() {
        return mTopicDetailsBeans;
    }

    public void setmTopicDetailsBeans(List<TopicDetailsBean> mTopicDetailsBeans) {
        this.mTopicDetailsBeans = mTopicDetailsBeans;
    }

}
