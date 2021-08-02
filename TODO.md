[x] Implement a button to toggle between showing the increasing data and showing per day data (disable sampled data in the former)
  - implemented the feature, need to implement the button/switch
  - a little awkward scaling is used because of the font dimension values, may cause issues when the font is not loaded

[x] Implement a function to draw a box with given content (strings) to show it attached to the current user point

[x] Save delta values in parseJSON(...)

[x] Add dark mode, make use of DOM `onclick` method

[x] Perform spline interpolation of the data

[x] Use colors specific to the data category?

[x] Add a retry option when data couldn't be fetched (reset dataError to false)

[x] Prevent the interpolated values from getting negative

[ ] Use origin at the bottom-left intersection?
  - forget about it!

[x] Drawing frames only when there is need

[x] Perform data segmentation, sampling - cannot show all the data if it can't be seen

[x] Save sampled data, process only once

[x] Remove mobile anti-scroll option (buggy)

[x] Fetch data one for all graphs

[x] Why is all the data double in value??
  - added a quick fix for now (... / 2)

Now, why the heck is the data value lesser than the one before (total)
Moreover, metadata.total and data[last].total doesn't match
  - because I have used Math.round(... / 2);
  - why am I getting doubled values????

[ ] Add little boxes showing milestones like
- lockdown started
- vaccination started
