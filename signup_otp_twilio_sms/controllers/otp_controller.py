# -*- coding: utf-8 -*-
# Part of Odoo, Aktiv Software PVT. LTD.
# See LICENSE file for full copyright & licensing details.

from odoo import http
from odoo.http import request


class Otp(http.Controller):
    @http.route(["/otp"], type="json", auth="public", website="True")
    def otp(self, phone):
        sms = request.env["twilio.sms"].create({"ph_number": phone})
        rec_list = sms.create_sms()
        return rec_list

    @http.route(["/otp/verify"], type="json", auth="public", website="True")
    def otp_verify(self, phone, otp_value):
        sms = request.env["twilio.sms"].search(
            [("ph_number", "=", phone)], order="id desc", limit=1
        )

        if sms and sms.is_otp_valid and otp_value == sms.otp:
            return True
        return False

    @http.route(
        ["/partner_verify/otp"], type="json", auth="public", website="True"
    )
    def partner_verify_otp(self, phone, check_phone):
        partner = (
            request.env["res.partner"]
            .sudo()
            .search([("mobile", "=", check_phone)], limit=1)
        )

        if partner:
            sms = request.env["twilio.sms"].create({"ph_number": phone})
            sms.create_sms()
            return True
        else:
            partner = (
                request.env["res.partner"]
                .sudo()
                .search([("mobile", "=", phone)], limit=1)
            )
            if partner:
                sms = request.env["twilio.sms"].create({"ph_number": phone})
                sms.create_sms()
                return True
            return False

    @http.route(["/otp/reset"], type="json", auth="public", website="True")
    def reset_url_create(self, phone, check_phone):
        partner = (
            request.env["res.partner"]
            .sudo()
            .search([("mobile", "=", phone)], limit=1)
        )
        partner.signup_custom_prepare()
        partner.signup_prepare()
        if partner:
            partner.compute_custom_signup_url()
            return partner.custom_signup_url
        else:
            partner = (
                request.env["res.partner"]
                .sudo()
                .search([("mobile", "=", check_phone)], limit=1)
            )
            partner.signup_custom_prepare()
            partner.signup_prepare()
            if partner:
                partner.compute_custom_signup_url()
                return partner.custom_signup_url
