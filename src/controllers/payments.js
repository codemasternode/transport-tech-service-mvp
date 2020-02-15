import stripe from 'stripe'

const stripePayments = stripe("sk_test_lq06lpS4lhnxZgQ0y5uh3tnT002ozlMvyE")

export async function startSubscription(req, res) {
    const session = await stripePayments.charges.create({
        payment_method_types: ['card'],
        subscription_data: {
            items: [{
                plan: 'plan_GiUjoZHA1Q0rMK',
            }],
            trial_from_plan: true
        },
        success_url: 'http://localhost:3000?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000',
    });
    console.log(session)
}

export async function updateSubscription(req, res) {

}