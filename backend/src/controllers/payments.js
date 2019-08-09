export async function redirectWithInfo(req, res) {
  if (req.body.status === "OK") {
    res.redirect("/checkPayment?statuss=OK");
  } else {
    res.redirect("/checkPayment?statuss=FAIL");
  }
}
