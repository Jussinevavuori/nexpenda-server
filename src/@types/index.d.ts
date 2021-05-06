type RequestUser = NonNullable<
  import("express").Request["data"]["auth"]["user"]
>;
