package com.calendar42.marvin.services.ui.datepicker;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.widget.NumberPicker;
import android.widget.TimePicker;

public class CustomTimePickerDialog extends TimePickerDialog {

    protected final int fmMinuteInterval;
    protected TimePicker mTimePicker;
    protected final OnTimeSetListener fmTimeSetListener;

    public CustomTimePickerDialog(Context context,
                                  OnTimeSetListener listener,
                                  int hourOfDay,
                                  int minute,
                                  boolean is24HourView,
                                  int minuteInterval) {

        super(context, listener, hourOfDay, minute, is24HourView);

        fmTimeSetListener = listener;
        fmMinuteInterval  = ((minuteInterval > 0) && (minuteInterval <= 30)) ? minuteInterval : 5;

        updateTime(hourOfDay, minute / fmMinuteInterval);
    }

    public CustomTimePickerDialog(Context context,
                                  OnTimeSetListener listener,
                                  int hourOfDay,
                                  int minute,
                                  boolean is24HourView) {
        //5 is default minuteInterval
        this(context, listener, hourOfDay, minute, is24HourView, 5);
    }

    @Override
    public void onClick(DialogInterface dialog, int which) {
        if (fmTimeSetListener != null && mTimePicker != null) {
            mTimePicker.clearFocus();
            fmTimeSetListener.onTimeSet(
                    mTimePicker,
                    mTimePicker.getCurrentHour(),
                    mTimePicker.getCurrentMinute() * fmMinuteInterval);
        }
    }

    @Override
    protected void onStop() {}

    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        try {
            Class<?> classForid = Class.forName("com.android.internal.R$id");
            Field timePickerField = classForid.getField("timePicker");
            mTimePicker = (TimePicker) findViewById(timePickerField.getInt(null));
            Field field = classForid.getField("minute");

            NumberPicker minuteSpinner = (NumberPicker)mTimePicker.findViewById(field.getInt(null));
            minuteSpinner.setMinValue(0);
            minuteSpinner.setMaxValue((60 / fmMinuteInterval) - 1);

            List<String> displayedValues = new ArrayList<String>();
            for (int i = 0; i < 60; i += fmMinuteInterval) {
                displayedValues.add(String.format("%02d", i));
            }
            minuteSpinner.setDisplayedValues(displayedValues.toArray(new String[0]));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}