# -*- coding: utf-8 -*-
# Part of Odoo, Aktiv Software PVT. LTD.
# See LICENSE file for full copyright & licensing details.

from odoo import fields, models, api


class ResConfigSetting(models.TransientModel):
    """Inherited res.config.settings for new fields"""

    _inherit = "res.config.settings"
    # New fields
    twilio_account_sid = fields.Char("Account SID")
    twilio_auth_token = fields.Char("Authentication Token")
    twilio_from_number = fields.Char("Phone Number")
    twilio_overwrite_odoo_sms = fields.Boolean("Overwrite Odoo SMS")

    @api.model
    def get_values(self):
        res = super(ResConfigSetting, self).get_values()
        param_obj = self.env["ir.config_parameter"]
        res.update(
            {
                "twilio_account_sid": param_obj.sudo().get_param(
                    "twilio_sms.twilio_account_sid"
                ),
                "twilio_auth_token": param_obj.sudo().get_param(
                    "twilio_sms.twilio_auth_token"
                ),
                "twilio_from_number": param_obj.sudo().get_param(
                    "twilio_sms.twilio_from_number"
                ),
                "twilio_overwrite_odoo_sms": param_obj.sudo().get_param(
                    "twilio_sms.twilio_overrwrite_odoo_sms"
                ),
            }
        )
        return res

    @api.model
    def set_values(self):
        super(ResConfigSetting, self).set_values()
        param_obj = self.env["ir.config_parameter"]
        param_obj.sudo().set_param(
            "twilio_sms.twilio_account_sid", self.twilio_account_sid
        )
        param_obj.sudo().set_param(
            "twilio_sms.twilio_auth_token", self.twilio_auth_token
        )
        param_obj.sudo().set_param(
            "twilio_sms.twilio_from_number", self.twilio_from_number
        )
        param_obj.sudo().set_param(
            "twilio_sms.twilio_overrwrite_odoo_sms",
            self.twilio_overwrite_odoo_sms,
        )
