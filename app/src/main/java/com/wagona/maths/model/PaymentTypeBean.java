package com.wagona.maths.model;

import java.io.Serializable;

/**
 * Created by sotsys-159 on 17/10/17.
 */

public class PaymentTypeBean implements Serializable {


    private String type_id;
    private String description;
    private String price;
    private String payer;


    public String getType_id() {
        return type_id;
    }

    public void setType_id(String type_id) {
        this.type_id = type_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getPayer() {
        return payer;
    }

    public void setPayer(String payer) {
        this.payer = payer;
    }
}
