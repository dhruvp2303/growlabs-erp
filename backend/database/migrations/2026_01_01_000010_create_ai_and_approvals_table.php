<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_alerts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('title');
            $table->string('module', 50);
            $table->string('severity', 50); // 'critical', 'warning', 'recommendation'
            $table->text('what');
            $table->text('why');
            $table->text('recommendation');
            $table->string('action_label');
            $table->jsonb('action_payload')->nullable();
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
        });

        Schema::create('approvals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('type', 50); // 'Purchase Order', 'Expense', 'Discount'
            $table->string('requester_name');
            $table->string('reason');
            $table->decimal('amount', 15, 2)->default(0.00);
            $table->text('ai_verdict');
            $table->string('status', 50)->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approvals');
        Schema::dropIfExists('ai_alerts');
    }
};
